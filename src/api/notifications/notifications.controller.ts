import { notification } from '@car-qr-link/apis';
import { Body, Controller, Get, Logger, NotImplementedException, Post } from '@nestjs/common';
import { NotificationsService } from 'src/core/notifications/notifications.service';

@Controller('notifications')
export class NotificationsController {
    private readonly logger = new Logger(NotificationsController.name);

    constructor(
        private readonly notificationsService: NotificationsService,
    ) { }

    @Post()
    async sendNotification(
        @Body() request: notification.SendNotificationRequest
    ): Promise<notification.SendNotificationResponse> {
        const notification = await this.notificationsService.notify(request.account, request.notification);

        return {
            notification: notification.notificaiton,
            answer: notification.answer,
        };
    }

    @Get('reasons')
    async getReasons(): Promise<notification.GetReasonsResponse> {
        return {
            reasons: await this.notificationsService.selectReasons(),
        };
    }
}
