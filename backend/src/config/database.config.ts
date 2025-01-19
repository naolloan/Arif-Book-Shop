import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';
import { Book } from '../modules/books/book.entity';
import { Cart } from 'src/modules/cart/cart.entity';
import { Order } from 'src/modules/orders/order.entity';

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'arif_bookshop.db', // Replace with your DB name
    entities: [User, Book, Cart, Order],
    synchronize: true, // Auto-sync entity changes with DB (turn off in production)
};





