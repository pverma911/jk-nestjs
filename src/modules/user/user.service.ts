import { Body, ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterDto } from './dto/register.dto';
import { ResponseService } from 'src/utils/response.utils';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { IServiceResponse } from 'src/interfaces/serviceResponse.interface';

/**
 * User Service
 */
@Injectable()
export class UserService extends ResponseService {
    constructor (
        private readonly userRepo: UserRepository,
        private readonly jwtService: JwtService,

    ) {
        super()
    }

    /**
 * Registers a new user.
 * @param payload - The registration data containing email, name, password, and role.
 * @returns A service response with the created user's ID.
 * @throws ConflictException if a user with the provided email already exists.
 */
    async register(payload: RegisterDto): Promise<IServiceResponse> {
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

        return this.serviceResponse(HttpStatus.CREATED, { userId: createdUser.id }, "Please proceed to login")
    }

    /**
 * Authenticates a user and returns a JWT token upon successful login.
 * @param payload - An object containing user login credentials (email and password).
 * @returns A service response with the JWT token and user details.
 * @throws UnauthorizedException if the credentials are invalid.
 */
    async login(payload: LoginDto): Promise<IServiceResponse> {
        const { email, password } = payload
        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('Invalid password');
        }

        const jwtPayload = { id: user.id, email: user.email, role: user.role };

        const accessToken = this.jwtService.sign(jwtPayload);

        return this.serviceResponse(HttpStatus.OK, { accessToken }, "Logged In")
    }
}
