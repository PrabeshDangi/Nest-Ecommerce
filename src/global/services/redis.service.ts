import { Injectable, OnModuleInit } from '@nestjs/common';
import { redisClient } from '../../common/config/redis.config'; // Import the configured Redis client
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly subscriber: Redis;
  private readonly prisma: PrismaService;
  constructor() {
    this.subscriber = redisClient.duplicate();
    this.prisma = new PrismaService();
  }

  async onModuleInit() {
    // Subscribe to product update and delete channels
    this.subscriber.subscribe(
      'product-update',
      'product-delete',
      (err, count) => {
        if (err) {
          console.error('Failed to subscribe to channels:', err);
        }
        console.log(`Subscribed to ${count} Redis channels`);
      },
    );

    // Handle incoming Pub/Sub messages
    this.subscriber.on('message', (channel, message) => {
      this.handleMessage(channel, message);
    });
  }

  // Handle Redis Pub/Sub messages
  private async handleMessage(channel: string, message: string) {
    const data = JSON.parse(message);

    if (channel === 'product-update') {
      console.log(`Product update received for product ${data.productId}`);
      await this.updateProductCache(data.productId);
    } else if (channel === 'product-delete') {
      console.log(`Product delete received for product ${data.productId}`);
      await this.invalidateProductCache(data.productId);
    }
  }

  // Update product cache when an update is published
  private async updateProductCache(productId: number) {
    const updatedProduct = await this.fetchProductFromDb(productId);
    await redisClient.set(
      `product:${productId}`,
      JSON.stringify(updatedProduct),
    );
    console.log(`Cache updated for product ${productId}`);
  }

  private async invalidateProductCache(productId: number) {
    await redisClient.del(`product:${productId}`);
    console.log(`Cache invalidated for product ${productId}`);
  }

  private async fetchProductFromDb(productId: number) {
    return await this.prisma.product.findUnique({ where: { id: productId } });
  }
}
