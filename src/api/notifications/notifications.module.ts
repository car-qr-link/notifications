import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsModule as CoreNotificationsModule } from 'src/core/notifications/notifications.module';

@Module({
  imports: [CoreNotificationsModule],
  controllers: [NotificationsController]
})
export class NotificationsModule { }
