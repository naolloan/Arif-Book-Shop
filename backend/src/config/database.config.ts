import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root', // Replace with your DB username
    password: 'password', // Replace with your DB password
    database: 'arif_bookshop', // Replace with your DB name
    entities: [User],
    synchronize: true, // Auto-sync entity changes with DB (turn off in production)
};
