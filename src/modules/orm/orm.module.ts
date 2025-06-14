import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from 'src/config/configuration.module';
import { ConfigurationService } from 'src/config/configuration.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => ({
        type: 'postgres',
        host: configService.dbHost,
        port: configService.dbPort,
        username: configService.dbUserName,
        password: configService.dbPassword,
        database: configService.dbName,
        entities: [User],
        synchronize: true,
      }),
    }),
  ],
})
export class OrmModule { }
