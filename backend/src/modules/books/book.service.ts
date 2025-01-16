import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
    ) {}

    // Create a new book
    async create(bookData: Partial<Book>): Promise<Book> {
        const book = this.bookRepository.create(bookData);
        return this.bookRepository.save(book);
    }

    // Get all books
    async findAll(page: number = 1, limit: number = 10, search?: string): Promise<Book[]> {
        const query = this.bookRepository.createQueryBuilder('book');
    
        if (search) {
            query.where('book.title LIKE :search OR book.author LIKE :search', {
                search: `%${search}%`,
            });
        }
    
        query.skip((page - 1) * limit).take(limit);
    
        return await query.getMany();
    }
    
    // Get a book by ID
    async findOne(id: number): Promise<Book | null> {
        return this.bookRepository.findOneBy({ id });
    }

    // Update a book
    async update(id: number, bookData: Partial<Book>): Promise<Book | null> {
        await this.bookRepository.update(id, bookData);
        return this.findOne(id);
    }

    // Delete a book
    async remove(id: number): Promise<void> {
        await this.bookRepository.delete(id);
    }
}


