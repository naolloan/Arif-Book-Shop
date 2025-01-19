import { Controller, Post, Get, UseGuards, Req, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewService } from './review.service';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { User } from '../users/user.entity';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':bookId')
    async createReview(
        @Req() request: RequestWithUser,
        @Param('bookId') bookId: number,
        @Body() body: { rating: number; comment: string },
    ) {
        const { userId } = request.user;
        const user = { id: userId } as User; // Map userId to a partial User object
        return this.reviewService.createReview(user, bookId, body.rating, body.comment);
}


    @Get(':bookId')
    async getBookReviews(@Param('bookId') bookId: number) {
        return this.reviewService.getBookReviews(bookId);
    }

    @Get(':bookId/average-rating')
    async getAverageRating(@Param('bookId') bookId: number) {
        return this.reviewService.getAverageRating(bookId);
    }
}
