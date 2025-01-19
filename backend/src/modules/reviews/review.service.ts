import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
        @InjectRepository(Book) private bookRepository: Repository<Book>,
    ) {}

    async createReview(user: User, bookId: number, rating: number, comment: string): Promise<Review> {
        const book = await this.bookRepository.findOneBy({ id: bookId });
        if (!book) {
            throw new Error('Book not found');
        }

        const review = this.reviewRepository.create({
            user,
            book,
            rating,
            comment,
        });

        return this.reviewRepository.save(review);
    }

    async getBookReviews(bookId: number): Promise<Review[]> {
        return this.reviewRepository.find({
            where: { book: { id: bookId } },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async getAverageRating(bookId: number): Promise<number> {
        const { avg } = await this.reviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'avg')
            .where('review.bookId = :bookId', { bookId })
            .getRawOne();

        return parseFloat(avg) || 0;
    }
}
