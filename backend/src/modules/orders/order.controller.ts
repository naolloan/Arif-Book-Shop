import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Role } from '../../common/roles.decorator';
import { User } from '../users/user.entity';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    // Place an order
    @Post()
    async placeOrder(@Body() user: User) {
        return this.orderService.placeOrder(user);
    }

    // Admin updates order status
    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Role('admin')
    async updateOrderStatus(
        @Param('id') id: number,
        @Body('status') status: string,
    ) {
        return this.orderService.updateOrderStatus(id, status);
    }

    // ✅ View Order History
    @Get('history')
    async getUserOrders(@Req() request: RequestWithUser) {
        const userId = request.user.userId; 
        return this.orderService.getUserOrders(userId);
    }

    @Post('checkout')
    async checkout(@Req() request: RequestWithUser) {
        const userId = request.user.userId;
        return this.orderService.checkout(userId);
    }
}