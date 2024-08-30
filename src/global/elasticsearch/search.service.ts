import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async searchDocuments(query: string) {
    const result = await this.elasticsearchService.search({
      index: 'products',
      body: {
        query: {
          match: {
            content: query,
          },
        },
      },
    });
    return result.hits.hits;
  }
}
