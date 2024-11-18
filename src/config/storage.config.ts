import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageConfig {
  public readonly url: string;
  public readonly prefix: string;
  public readonly ttl: number;

  constructor(configService: ConfigService) {
    this.url = configService.get(
      'STORAGE__URL',
      'redis://localhost:6379/0',
    );
    this.prefix = configService.get(
      'STORAGE__PREFIX',
      'storage:',
    );
    this.ttl = configService.get(
      'STORAGE__TTL',
      5 * 60,
    );
  }
}
