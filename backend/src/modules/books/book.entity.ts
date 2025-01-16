import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
