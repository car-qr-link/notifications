import { Module } from '@nestjs/common';
import { MessagingModule } from '../messaging/messaging.module';
import { StorageModule } from '../storage/storage.module';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [StorageModule, MessagingModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule { }
