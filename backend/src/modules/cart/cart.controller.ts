import { Controller, Post, Get, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post('add/:bookId')
    async addToCart(@Param('bookId') bookId: number, @Body() user: User) {
        const book = new Book();
        book.id = bookId;
        return this.cartService.addToCart(user, book);
    }

    @Get()
    async getCart(@Body() user: User) {
        return this.cartService.getCartItems(user);
    }

    @Delete('remove/:bookId')
    async removeFromCart(@Param('bookId') bookId: number, @Body() user: User) {
        const book = new Book();
        book.id = bookId;
        return this.cartService.removeFromCart(user, book);
    }

    @Delete('clear')
    async clearCart(@Body() user: User) {
        return this.cartService.clearCart(user);
    }
}
