import { notification, NotificationChannel } from '@car-qr-link/apis';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { StorageConfig } from 'src/config/storage.config';
import { FIELD_ANSWER, FIELD_NOTIFICATION, Notification } from './storage.dto';

@Injectable()
export class StorageService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(StorageService.name)
    private readonly client: RedisClientType;

    private readonly prefixNotifications: string;
    private readonly prefixMessages: string;

    constructor(
        private readonly config: StorageConfig,
    ) {
        this.prefixNotifications = this.config.prefix + 'notifications:';
        this.prefixMessages = this.config.prefix + 'messages:';

        this.client = createClient({ url: this.config.url });
        this.client.on('error', (err) => {
            throw err;
        });
    }

    async setNotification(
        accountId: string,
        notification: notification.Notification,
        channel: NotificationChannel,
        address: string
    ): Promise<void> {
        const notificationKey = this.prefixNotifications + accountId;
        const messageKey = this.prefixMessages + channel + ':' + address;

        await this.client.multi()
            .hSet(notificationKey,
                FIELD_NOTIFICATION,
                JSON.stringify(notification)
            )
            .expire(notificationKey, this.config.ttl)
            .set(messageKey, accountId, { EX: this.config.ttl })
            .execAsPipeline();
    }

    async setAnswer(accountId: string, answer: notification.Answer): Promise<void> {
        const notificationKey = this.prefixNotifications + accountId;
        if (!(await this.client.exists(notificationKey))) {
            return;
        }

        await this.client.hSet(notificationKey, FIELD_ANSWER, JSON.stringify(answer));
    }

    async getNotification(accountId: string): Promise<Notification | null> {
        const key = this.prefixNotifications + accountId;

        const notificationKV = await this.client.hGetAll(key);
        if (!(FIELD_NOTIFICATION in notificationKV)) {
            return null;
        }

        return {
            notification: JSON.parse(notificationKV[FIELD_NOTIFICATION]),
            answer: JSON.parse(notificationKV[FIELD_ANSWER]),
        };
    }

    async getAccountIdByAddress(channel: NotificationChannel, address: string): Promise<string | null> {
        const key = this.prefixMessages + channel + ':' + address;
        const accountId = await this.client.get(key);
        if (accountId) {
            return accountId;
        }

        return null;
    }

    async onModuleInit() {
        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
