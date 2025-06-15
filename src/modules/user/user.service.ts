import { Body, ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterDto } from './dto/register.dto';
import { ResponseService } from 'src/utils/response.utils';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { IServiceResponse } from 'src/interfaces/serviceResponse.interface';
import { UpdateRoleDto } from './dto/updateRole.dto';

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

    /**
   * Updates the role of a user by their user ID.
   * @param userId - The unique identifier of the user whose role is to be updated.
   * @param payload - An object containing the new role for the user.
   * @returns A service response indicating the result of the update operation.
   * @throws NotFoundException if the user is not found.
   */
    async updateRole(userId: string, payload: UpdateRoleDto) {
        const { role } = payload
        const user = await this.userRepo.findById(userId);

        if (!user) throw new NotFoundException('User not found');

        user.role = role;

        await this.userRepo.save(user);

        return this.serviceResponse(HttpStatus.OK, {}, "User role has been updated")
    }

    async getUserById(id:string){
        return this.userRepo.findById(id);
    }

    /**
 * Retrieves the user's role and returns a standardized service response.
 *
 * @param {string} role - The role of the user to be returned in the response.
 * @returns {Promise<object>} A promise that resolves to a service response containing the user's role and a success message.
 */
    getUserRole(role: string) {
        return this.serviceResponse(HttpStatus.OK, { role }, "User role has been updated")
    }
}
