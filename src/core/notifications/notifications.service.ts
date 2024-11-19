import { accounts, BaseAccount, Contact, messaging, notification, NotificationChannel } from '@car-qr-link/apis';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MESSAGE_RECEIVED } from '../messaging/messaging.events';
import { StorageService } from '../storage/storage.service';
import { MessagingService } from '../messaging/messaging.service';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private readonly storage: StorageService,
        private readonly messagingService: MessagingService,
    ) { }

    async notify(
        account: BaseAccount,
        data?: { reasonId?: string }
    ): Promise<{ notificaiton: notification.Notification, answer?: notification.Answer }> {
        const notification = await this.storage.getNotification(account.id);
        if (!notification) {
            return {
                notificaiton: await this.sendNotification(account, data?.reasonId),
            };
        }

        return {
            notificaiton: notification.notification,
            answer: notification.answer,
        };
    }

    async selectReasons(): Promise<notification.Reason[]> {
        return REASONS;
    }


    @OnEvent(EVENT_MESSAGE_RECEIVED)
    async onAnswer(payload: messaging.MessageReceived): Promise<void> {
        const { channel, from, message } = payload;

        this.logger.debug('onAnswer', payload);

        const accountId = await this.storage.getAccountIdByAddress(channel, from);
        if (!accountId) {
            this.logger.warn('No account found', payload);
            return;
        }

        await this.storage.setAnswer(accountId, {
            message: message,
            receivedAt: new Date(),
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    private async sendNotification(account: BaseAccount, reasonId?: string): Promise<notification.Notification> {
        const contact = this.getPriorityContact(account.contacts);
        if (!contact) {
            throw new BadRequestException('No available contact');
        }

        const reason = reasonId ? REASONS.find((reason) => reason.id === reasonId)?.title : undefined;
        const text = `Пожалуйста, подойдите к машине. ${reason ? `Причина: ${reason.toLowerCase()}` : ''}`;
        const notification: notification.Notification = {
            id: this.newId(),
            reasonId: reasonId,
            sentAt: new Date(),
        };

        await this.messagingService.send(contact.channel, contact.address, text);
        await this.storage.setNotification(account.id, notification, contact.channel, contact.address);

        return notification;
    }

    private getPriorityContact(contacts: Contact[]): Contact | null {
        for (const channel of CHANNELS_PRIORITY) {
            const contact = contacts.find((contact) => contact.channel === channel);
            if (contact) {
                return contact;
            }
        }

        return null;
    }

    private newId(): string {
        return Math.random().toString(36).slice(2);
    }
}

const REASONS: notification.Reason[] = [
    {
        id: "roadblock",
        title: "Мешает проезду",
    },
    {
        id: "evacuator",
        title: "Эвакуатор",
    },
    {
        id: "accident",
        title: "ДТП",
    },
];

const CHANNELS_PRIORITY: NotificationChannel[] = [
    NotificationChannel.Telegram,
    NotificationChannel.Phone,
    NotificationChannel.Email,
];
