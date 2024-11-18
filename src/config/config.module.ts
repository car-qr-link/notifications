import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { MessagingConfig } from './messaging.config';
import { StorageConfig } from './storage.config';


@Module({
    imports: [NestConfigModule.forRoot()],
    providers: [MessagingConfig, StorageConfig],
    exports: [MessagingConfig, StorageConfig],
})
export class ConfigModule { }
