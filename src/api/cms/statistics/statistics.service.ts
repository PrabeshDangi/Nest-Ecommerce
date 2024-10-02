import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateStatDTO } from './dto/updatestat.dto';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { CreateStatDTO } from './dto/createstat.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}
  async getStat() {
    const stats = await this.prisma.statistics.findMany();

    if (stats.length === 0) {
      throw new NotFoundException('Stats not found!!');
    }

    return stats;
  }
  async createStat(createstatdto: CreateStatDTO) {
    const { value, description } = createstatdto;

    const newStat = await this.prisma.statistics.create({
      data: {
        value,
        description,
      },
    });

    return newStat;
  }

  async updateStat(id: number, updatestatdto: UpdateStatDTO) {
    const statAvalilable = await this.prisma.statistics.findUnique({
      where: { id },
    });

    if (!statAvalilable) {
      throw new NotFoundException('Stat not found!!');
    }
    const updateData: any = {
      ...updatestatdto,
    };

    const updatedStat = await this.prisma.statistics.update({
      where: { id },
      data: updateData,
    });

    return updatedStat;
  }
  async deleteStat(id: number) {
    const statAvalilable = await this.prisma.statistics.findUnique({
      where: { id },
    });

    if (!statAvalilable) {
      throw new NotFoundException('Stat not found!!');
    }

    await this.prisma.statistics.delete({
      where: { id },
    });

    return { mesage: 'Stat deleted successfully!!' };
  }
}
