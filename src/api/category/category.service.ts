import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { addCategoryDto } from './dto/addcategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getCategories(req: Request, res: Response) {
    const categories = await this.prisma.category.findMany();

    if (categories.length === 0) {
      throw new NotFoundException('No categories found!!');
    }

    return res.status(200).json({
      message: 'Categories fetched successfully!!',
      data: categories,
    });
  }

  async addCategory(
    addcaetegorydto: addCategoryDto,
    req: Request,
    res: Response,
  ) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const { name } = addcaetegorydto;

    const newcategory = await this.prisma.category.create({
      data: {
        name,
      },
    });

    return res.status(201).json({
      message: 'New category added!!',
      data: newcategory,
    });
  }

  async deleteCategory(id: number, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authroized!!');
    }

    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found!!');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({
      message: 'Category deleted successfully!!',
    });
  }

  async updateCategory(
    id: number,
    updatedto: addCategoryDto,
    req: Request,
    res: Response,
  ) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not athorized!!');
    }

    const { name } = updatedto;

    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found!!');
    }

    const newcategory = await this.prisma.category.update({
      where: { id },
      data: {
        name: name,
      },
    });

    return res.json({
      message: 'Category updated successfully!!',
      data: newcategory,
    });
  }
}
