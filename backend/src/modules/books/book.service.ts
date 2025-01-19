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
        genre?: string | string[], // Accept single or multiple genres
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
    
        // Validate genres
        if (genre) {
            if (!Array.isArray(genre)) {
                genre = [genre]; // Convert single genre to array
            }
    
            // Fetch available genres from the database
            const availableGenres = await this.bookRepository
                .createQueryBuilder('book')
                .select('DISTINCT book.genre', 'genre')
                .getRawMany();
    
            const validGenres = availableGenres.map(g => g.genre.toLowerCase());
    
            // Check if any provided genre is invalid
            const invalidGenres = genre.filter(g => !validGenres.includes(g.toLowerCase()));
    
            if (invalidGenres.length > 0) {
                throw new Error(
                    `Invalid genre(s) provided: ${invalidGenres.join(', ')}. Available genres: ${validGenres.join(', ')}`
                );
            }
    
            // Filter by valid genres
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
    
        return query.getMany();
    }    
}