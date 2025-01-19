import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { BookModule } from '../books/book.module';
import { Book } from '../books/book.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Review, Book]),
        BookModule,
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
})
export class ReviewModule {}