import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { ConfigurationService } from 'src/config/configuration.service';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/modules/user/user.enum';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (private readonly configService: ConfigurationService,
        private readonly userService: UserService,
    ) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.jwtSecret,
        });
    }

    async validate(payload: { id: string, role: UserRole }) {
        const user = await this.userService.getUserById(payload.id);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

}
