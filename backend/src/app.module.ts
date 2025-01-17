import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { databaseConfig } from './config/database.config'; // Adjust path if needed
import { BookModule } from './modules/books/book.module';
import { Book } from './modules/books/book.entity';
import { CartModule } from './modules/cart/cart.module';
import { UserModule } from './modules/users/user.module';
import { OrderModule } from './modules/orders/order.module';
import { ReviewModule } from './modules/reviews/review.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig), // Integrate TypeORM with the database
    ConfigModule.forRoot({ isGlobal: true }),  // ✅ Load .env globally
    AuthModule,
    BookModule,
    CartModule,
    UserModule,
    OrderModule,
    ReviewModule,
  ],
})
export class AppModule {}
