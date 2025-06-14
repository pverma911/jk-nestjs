import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/configuration.module';
import { OrmModule } from './modules/orm/orm.module';

@Module({
  imports: [
    ConfigurationModule,
    OrmModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
