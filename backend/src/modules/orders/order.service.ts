import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private cartService: CartService,
    ) {}

    async placeOrder(user: User): Promise<Order> {
        // Get the user's cart items
        const cartItems = await this.cartService.getCartItems(user);

        // If the cart is empty, throw an error
        if (!cartItems.length) {
            throw new Error('Your cart is empty');
        }

        // Calculate the total price
        const totalPrice = cartItems.reduce((total, item) => {
            return total + item.book.price * item.quantity;
        }, 0);

        // Create the order
        const order = this.orderRepository.create({
            user: user,  // Link the user to the order
            items: cartItems.map(item => ({
                bookId: item.book.id,
                title: item.book.title,
                quantity: item.quantity,
                price: item.book.price,
            })),
            totalPrice: totalPrice,
            status: 'Pending',
        });

        // Save the order to the database
        await this.orderRepository.save(order);

        // Clear the user's cart after placing the order
        await this.cartService.clearCart(user);

        return order;
    }

    async updateOrderStatus(orderId: number, status: string): Promise<Order> {
        const order = await this.orderRepository.findOneBy({ id: orderId });

        // Check if the order exists
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }

        // Validate status
        const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Valid statuses are: ${validStatuses.join(', ')}`);
        }

        order.status = status;
        return this.orderRepository.save(order);
    }

    async getUserOrders(userId: number) {
        return this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async checkout(userId: number): Promise<Order> {
        // Fetch the user
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // Get cart items
        const cartItems = await this.cartService.getCartItems(user); // Pass the user object
        if (!cartItems.length) {
            throw new Error('Cart is empty');
        }

        // Calculate total price
        const totalPrice = await this.cartService.calculateTotalPrice(userId); // Pass the user object

        // Create the order
        const order = this.orderRepository.create({
            user, // Pass the full user object
            items: cartItems.map(item => ({
                bookId: item.book.id,
                title: item.book.title,
                quantity: item.quantity,
                price: item.book.price,
            })),
            totalPrice,
            status: 'Pending',
        });

        // Save the order and clear the cart
        await this.orderRepository.save(order);
        await this.cartService.clearCart(user); // Pass the user object

        return order;
    }
}