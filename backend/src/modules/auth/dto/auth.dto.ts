import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class AuthDto {
    @IsEmail()
    email!: string;

    @IsString()
    username!: string;

    @IsString()
    @MinLength(8)
    password!: string;

    @IsOptional()
    @IsString()
    role?: string;
}