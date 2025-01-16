import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './book.entity';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async createBook(@Body() bookData: CreateBookDto): Promise<Book | null> {
        return this.bookService.create(bookData);
    }

    @Get()
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.findAll();
    }

    @Get(':id')
    async getBookById(@Param('id') id: number): Promise<Book | null> {
        return this.bookService.findOne(id);
    }

    @Put(':id')
    async updateBook(@Param('id') id: number, @Body() bookData: Partial<Book>): Promise<Book | null> {
        return this.bookService.update(id, bookData);
    }

    @Delete(':id')
    async deleteBook(@Param('id') id: number): Promise<void> {
        return this.bookService.remove(id);
    }
}

