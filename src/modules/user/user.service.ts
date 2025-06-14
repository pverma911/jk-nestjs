import { Body, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterDto } from './dto/register.dto';
import { ResponseService } from 'src/utils/response.utils';

/**
 * User Service
 */
@Injectable()
export class UserService extends ResponseService {
    constructor (
        private readonly userRepo: UserRepository
    ) {
        super()
    }
    async register(payload: RegisterDto) {
        const { email, name, password, role } = payload

        // Check if the user already exists with the provided email
        const user = await this.userRepo.findUserByEmail(email)
        if (user) {
            throw new ConflictException('User with this email already exists');
        }

        // If everything is fine, create the user
        const createUser = this.userRepo.create({
            name,
            email,
            role,
            password
        })

        const createdUser = await this.userRepo.save(createUser);

        return this.serviceResponse(HttpStatus.CREATED, { userId: createdUser.id }, "User Created")
    }
}
