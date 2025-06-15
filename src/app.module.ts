import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/configuration.module';
import { OrmModule } from './modules/orm/orm.module';
import { UserModule } from './modules/user/user.module';
import { DocumentModule } from './modules/document/document.module';
import { DocumentModule } from './modules/document/document.module';

@Module({
  imports: [
    ConfigurationModule,
    OrmModule,
    UserModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
