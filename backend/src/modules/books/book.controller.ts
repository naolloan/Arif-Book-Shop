import { 
    Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, 
    UsePipes, UseGuards, UploadedFile, UseInterceptors, Query 
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './book.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Role } from '../../common/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role('admin')
    async createBook(@Body(new ValidationPipe()) bookData: CreateBookDto): Promise<Book | null> {
        return this.bookService.create(bookData);
    }

    @Post('upload')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role('admin')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    }))
    async uploadBookCover(@UploadedFile() file: Express.Multer.File) {
        return { filePath: `/uploads/${file.filename}` };
    }

    @Get()
    async getBooks(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
    ): Promise<Book[]> {
        return this.bookService.findAll(page, limit, search);
    }
    
    @Get(':id')
    async getBookById(@Param('id') id: number): Promise<Book | null> {
        return this.bookService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role('admin')
    async updateBook(@Param('id') id: number, @Body() bookData: Partial<Book>): Promise<Book | null> {
        return this.bookService.update(id, bookData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role('admin')
    async deleteBook(@Param('id') id: number): Promise<void> {
        return this.bookService.remove(id);
    }
}