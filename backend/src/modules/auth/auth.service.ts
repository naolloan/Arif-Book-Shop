import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(userData: any) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = this.userRepository.create({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || 'user',
        });

        await this.userRepository.save(newUser);
        return { message: 'User registered successfully!' };
    }

    async login(userData: any) {
        const user = await this.userRepository.findOneBy({ email: userData.email });
        if (user && await bcrypt.compare(userData.password, user.password)) {
            const payload = { userId: user.id, email: user.email, role: user.role};
            const token = this.jwtService.sign(payload);
            return {
            accessToken: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,  // ✅ This must match JwtStrategy
                expiresIn: process.env.JWT_EXPIRES_IN,
            }),
        };
        }
        return { message: 'Invalid credentials' };
    }
}