import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../user.enum';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}
