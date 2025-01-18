import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.id)
    user!: User;

    @ManyToOne(() => Book, book => book.id)
    book!: Book;

    @Column({ default: 1 })
    quantity!: number;
}
