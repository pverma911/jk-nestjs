import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Service class to fetch env data
 */
@Injectable()

export class ConfigurationService {
    constructor (private readonly configService: ConfigService) { }

    get appPort(): number {
        return <string> this.configService.get<string>("PORT") ? Number(this.configService.get<string>("PORT")) : 8080
    }

    get dbHost(): string {
        return <string> this.configService.get<string>("DB_HOST");
    }

    get dbName(): string {
        return <string> this.configService.get<string>("DB_NAME");
    }

    get dbPort(): number {
        return <string> this.configService.get<string>("DB_PORT") ? Number(this.configService.get<string>("DB_PORT")) : 5432
    }

    get dbUserName(): string {
        return <string> this.configService.get<string>("DB_USER");
    }

    get dbPassword(): string {
        return <string> this.configService.get<string>("DB_PASSWORD");
    }

    get jwtSecret(): string {
        return <string> this.configService.get<string>("JWT_SECRET");
    }
}
