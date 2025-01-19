import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
    ) {}

    // Add a book to the cart
    async addToCart(user: User, book: Book, quantity: number = 1) {
        const existingItem = await this.cartRepository.findOne({ where: { user, book } });

        if (existingItem) {
            existingItem.quantity += quantity;
            return this.cartRepository.save(existingItem);
        }

        const newItem = this.cartRepository.create({ user, book, quantity });
        return this.cartRepository.save(newItem);
    }

    // View cart items
    async getCartItems(user: User) {
        return this.cartRepository.find({ where: { user }, relations: ['book'] });
    }

    // Remove an item from the cart
    async removeFromCart(user: User, book: Book) {
        return this.cartRepository.delete({ user, book });
    }

    // Clear the cart
    async clearCart(user: User) {
        return this.cartRepository.delete({ user });
    }

    // Add a method to calculate the total price of the cart
    async calculateTotalPrice(userId: number): Promise<number> {
        const cartItems = await this.cartRepository.find({
            where: { user: { id: userId } },
            relations: ['book'],
        });

        return cartItems.reduce((total, item) => {
            return total + item.book.price * item.quantity;
        }, 0);
    }

}