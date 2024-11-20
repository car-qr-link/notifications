import { Module } from '@nestjs/common';
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [NotificationsModule, MessagingModule, StorageModule],
})
export class CoreModule {}
