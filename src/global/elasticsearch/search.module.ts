import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import * as fs from 'fs';
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: process.env.ELASTIC_URL,
        auth: {
          username: process.env.ELASTIC_USERNAME,
          password: process.env.ELASTIC_PASSWORD,
        },
        tls: {
          rejectUnauthorized: true,
          ca: fs.readFileSync(process.env.ELASTIC_CERT_PATH, 'utf-8'),
        },
      }),
    }),
  ],
  providers: [SearchService],
  exports: [ElasticsearchModule,SearchService],
})
export class SearchModule {}
