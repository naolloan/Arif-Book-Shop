import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { User } from '../users/user.entity'; 

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, User]), 
        CartModule,
    ],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}


