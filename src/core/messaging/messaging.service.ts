import { messaging, NotificationChannel } from '@car-qr-link/apis';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagingConfig } from 'src/config/messaging.config';
import { EVENT_MESSAGE_RECEIVED } from './messaging.events';

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MessagingService.name)
  private readonly client: messaging.Client;

  private stopFn: () => void;

  constructor(
    private readonly config: MessagingConfig,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.client = new messaging.Client(config.brokerUrl);
    this.client.on('error', (err) => {
      this.logger.error(err);
    });
  }

  async send(
    channel: NotificationChannel,
    address: string,
    content: string,
  ): Promise<void> {
    await this.client.publish(this.config.sendPrefix + channel, {
      channel: channel,
      message: content,
      to: address,
    });
  }

  async onModuleInit() {
    await this.client.start();

    this.stopFn = await this.client.subscribe(this.config.receiveName, async (queue: string, message: messaging.MessageReceived) => {
      this.eventEmitter.emit(EVENT_MESSAGE_RECEIVED, message);
    });
  }

  async onModuleDestroy() {
    this.stopFn();
    await this.client.close();
  }
}
