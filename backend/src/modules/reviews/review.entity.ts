import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    rating!: number;

    @Column({ type: 'text' })
    comment!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.reviews)
    user!: User;

    @ManyToOne(() => Book, (book) => book.reviews)
    book!: Book;
}
