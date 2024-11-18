import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessagingConfig {
  public readonly brokerUrl: string;
  public readonly sendPrefix: string;
  public readonly receiveName: string;

  constructor(configService: ConfigService) {
    this.brokerUrl = configService.get(
      'MESSAGING__BROKER_URL',
      'redis://localhost:6379/0',
    );
    this.sendPrefix = configService.get(
      'MESSAGING__SEND_PREFIX',
      'messages:send:',
    );
    this.receiveName = configService.get(
      'MESSAGING__RECEIVE_NAME',
      'messages:received',
    );
  }
}
