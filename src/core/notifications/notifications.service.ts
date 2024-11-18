import { BaseAccount, messaging, notification } from '@car-qr-link/apis';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MESSAGE_RECEIVED } from '../messaging/messaging.events';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    async notify(
        account: BaseAccount,
        data?: { reasonId?: string }
    ): Promise<{ notificaiton: notification.Notification, answer?: notification.Answer }> {
        const reason = data?.reasonId ? REASONS.find((reason) => reason.id === data.reasonId)?.title : undefined;

        return {
            notificaiton: {
                id: '',
                sentAt: new Date(),
            }
        }
    }

    async selectReasons(): Promise<notification.Reason[]> {
        return REASONS;
    }


    @OnEvent(EVENT_MESSAGE_RECEIVED)
    async onAnswer(payload: messaging.MessageReceived): Promise<void> {

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