import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from 'src/config/configuration.module';
import { ConfigurationService } from 'src/config/configuration.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/stratergies/jwt.stratergy';

@Module({
    imports: [
        PassportModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigurationModule],
            inject: [ConfigurationService],
            useFactory: async (configService: ConfigurationService) => ({
                secret: configService.jwtSecret,
                signOptions: { expiresIn: '5d' },
            }),
        }),
        ConfigurationModule
    ],
    controllers: [UserController],
    providers: [UserRepository, UserService, JwtStrategy],
})
export class UserModule { }
