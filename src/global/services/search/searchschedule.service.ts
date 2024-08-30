import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { BulkResponse } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchScheduleService {
  constructor(
    private prisma: PrismaService,
    private elasticsearchService: ElasticsearchService, 
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async bulkIndexProducts() {
    const products = await this.prisma.product.findMany({
      include: { ratings: true },
    });

    const body = products.flatMap((product) => [
      { index: { _index: 'products', _id: product.id.toString() } },
      {
        title: product.title,
        ratings: product.ratings.map((r) => r.rating),
      },
    ]);

    const bulkResponse: BulkResponse = await this.elasticsearchService.bulk({
      refresh: true,
      body,
    });

    if (bulkResponse.errors) {
      console.error('Bulk indexing errors:', bulkResponse.errors);
    } else {
      console.log('Bulk indexing successful');
    }
  }
}