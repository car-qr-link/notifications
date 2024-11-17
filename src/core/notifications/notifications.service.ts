import { notification } from '@car-qr-link/apis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
    async selectReasons(): Promise<notification.Reason[]> {
        return REASONS;
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