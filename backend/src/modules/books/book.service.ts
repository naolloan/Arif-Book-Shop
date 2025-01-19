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

    async searchAndFilterBooks(
        search?: string,
        genre?: string | string[],
        minPrice?: number,
        maxPrice?: number,
        sortBy?: string,
        order: 'ASC' | 'DESC' = 'ASC',
    ): Promise<Book[]> {
        const query = this.bookRepository.createQueryBuilder('book');
    
        if (search) {
            query.andWhere('(book.title LIKE :search OR book.author LIKE :search)', {
                search: `%${search}%`,
            });
        }
    
        if (genre) {
            if (!Array.isArray(genre)) {
                genre = [genre];
            }

            console.log('Genres to match:', genre.map(g => g.toLowerCase()));
            query.andWhere('LOWER(book.genre) IN (:...genres)', {
                genres: genre.map(g => g.toLowerCase()),
            });
        }
    
        if (minPrice) {
            query.andWhere('book.price >= :minPrice', { minPrice });
        }
    
        if (maxPrice) {
            query.andWhere('book.price <= :maxPrice', { maxPrice });
        }
    
        if (sortBy) {
            query.orderBy(`book.${sortBy}`, order);
        }

        const books = await query.getMany();

        if (books.length === 0) {
            console.warn('No books found matching the query.');
        }

        return books;
    }
}