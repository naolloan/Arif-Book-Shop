import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { databaseConfig } from './config/database.config'; // Adjust path if needed
import { BookModule } from './modules/books/book.module';
import { Book } from './modules/books/book.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig), // Integrate TypeORM with the database
    AuthModule,
    BookModule,
  ],
})
export class AppModule {}




