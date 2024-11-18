import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { StorageConfig } from 'src/config/storage.config';

@Injectable()
export class StorageService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(StorageService.name)
    protected readonly client: RedisClientType;

    constructor(
        private readonly config: StorageConfig,
    ) {
        this.client = createClient({ url: this.config.url });
        this.client.on('error', (err) => {
            throw err;
        });
    }

    async onModuleInit() {
        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
