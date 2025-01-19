import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.id)
    user!: User;

    @Column('json')
    items!: any[];  // Stores cart items (book IDs, titles, quantities, prices)

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice!: number;

    @Column({ default: 'Pending' }) // Order status: Pending, Shipped, Delivered, Cancelled
    status!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Order, (order) => order.items)
    order!: Order;

    @Column()
    bookId!: number;

    @Column()
    title!: string;

    @Column()
    quantity!: number;

    @Column('decimal')
    price!: number;
}
