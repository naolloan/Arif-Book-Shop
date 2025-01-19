import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from '../reviews/review.entity';

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    author!: string;

    @Column()
    genre!: string;

    @Column('decimal')
    price!: number;

    @Column({ nullable: true })
    description!: string;

    @Column({ nullable: true })
    coverImage!: string;  // URL or filename for the book cover

    @OneToMany(() => Review, (review) => review.book)
    reviews!: Review[];
}




