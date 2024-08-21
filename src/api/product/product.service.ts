import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/createproduct.dto';
import { Request, Response } from 'express';
import { Prisma, Product, Size } from '@prisma/client';
import { UpdateProductDto } from './dto/updateproduct.dto';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { ImageUploadService } from 'src/global/services/imageupload.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private uploadImage: ImageUploadService,
  ) {}

  async searchProduct(sstring: string) {
    const query = sstring
      .split(' ')
      .map((term) => `${term}:*`)
      .join(' & ');

    const results = await this.prisma.$queryRaw<Product[]>`
        SELECT * FROM "Product" 
        WHERE to_tsvector('english', "title") 
        @@ to_tsquery('english', ${query}::text)
    `;

    return {
      results,
    };
  }

  async getNewArrival() {
    const newItem = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return newItem;
  }

  async getAllProducts(res: Response) {
    const products = await this.prisma.product.findMany();

    if (products.length === 0) {
      throw new NotFoundException('No products found!!');
    }

    return res.status(200).json({
      message: 'Products fetched successfully!!',
      count: products.length,
      data: products,
    });
  }

  async getProduct(id: number, res: Response) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found!!');
    }

    return res.status(200).json({
      message: 'Product fetched successfully!!',
      data: product,
    });
  }

  async getBestSellingProducts(res: Response) {
    const products = await this.prisma.product.findMany({
      orderBy: {
        soldqunatity: 'desc',
      },
      take: 10,
      select: {
        title: true,
        description: true,
        brand: true,
        price: true,
        image: true,
        rating: true,
        availability: true,
        soldqunatity: true,
      },
    });

    if (products.length === 0) {
      throw new NotFoundException('No best selling products found!!');
    }

    return res.status(200).json({
      status: true,
      message: 'Best selling products fetched successfully!!',
      data: products,
    });
  }

  async getProductsByCategoryId(id: number, res: Response) {
    const categoryAvailable = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!categoryAvailable) {
      throw new NotFoundException('Category not found!!');
    }

    const response = {
      id: categoryAvailable.id,
      name: categoryAvailable.name,
      products: categoryAvailable.products,
    };

    if (response.products.length === 0) {
      return res.status(404).json({
        message: 'No items found for the given category!!',
      });
    }
    return res.status(200).json({
      message: 'Products fetched successfully!!',
      data: response,
    });
  }

  async addProduct(
    files: Express.Multer.File[],
    createproductdto: CreateProductDto,
    req: Request,
    res: Response,
  ) {
    console.log('add project');
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }
    console.log(files);

    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image file is required');
    }
    //For the single image
    //const imageUrl = await this.uploadImage.uploadImage(file);

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const imageUrl = await this.uploadImage.uploadImage(file);
        if (!imageUrl) {
          throw new BadRequestException('Image uploading error!!');
        }
        return imageUrl;
      }),
    );

    if (!imageUrls) {
      throw new BadRequestException('Image uploading error!!');
    }

    // console.log(createproductdto);
    const categoryIds = createproductdto.categories
      .split(',')
      .map((categoryId) => parseInt(categoryId.trim()))
      .filter((id) => !isNaN(id));

    const newProduct = await this.prisma.product.create({
      data: {
        title: createproductdto.title,
        price: parseFloat(createproductdto.price as unknown as string),
        image: imageUrls,
        discountprice: parseFloat(
          createproductdto.discountprice as unknown as string,
        ),
        rating: parseFloat(createproductdto.rating as unknown as string),
        discounttag: createproductdto.discounttag == ('true' as unknown),
        sizes: createproductdto.sizes as Size,
        returnpolicy: createproductdto.returnpolicy,
        description: createproductdto.description,
        brand: createproductdto.brand,
        availability: createproductdto.availability == ('true' as unknown),
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
    });

    if (!newProduct) {
      throw new BadRequestException('Error adding the new product');
    }

    return res.status(201).json({
      message: 'Successfully added new product!!',
      data: newProduct,
    });
  }

  async updateProduct(
    id: number,
    updateproductdto: UpdateProductDto,
    req: Request,
    res: Response,
  ) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }
    const categoryIds = updateproductdto.categories
      ?.split(',')
      ?.map((categoryId) => parseInt(categoryId.trim()))
      ?.filter((id) => !isNaN(id));

    const updateData: any = {
      ...updateproductdto,
    };

    // Only connect categories if they are provided
    if (categoryIds && categoryIds.length > 0) {
      updateData.categories = {
        connect: categoryIds.map((id) => ({ id })),
      };
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: 'Product updated successfully!',
      data: updatedProduct,
    });
  }

  async deleteProduct(id: number, req: Request, res: Response) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new NotFoundException('Prouct not found!!');
    }

    await this.prisma.product.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: 'Product deleted successfully!!',
    });
  }

  async updateProductImage(
    id: number,
    files: Express.Multer.File[],
    req: Request,
    res: Response,
  ) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image file is required');
    }

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const imageUrl = await this.uploadImage.uploadImage(file);
        if (!imageUrl) {
          throw new BadRequestException('Image uploading error!!');
        }
        return imageUrl;
      }),
    );

    if (!imageUrls) {
      throw new BadRequestException('Image uploading failed!!');
    }

    const updatedImage = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        image: imageUrls,
      },
    });
    return res.status(200).json({
      status: true,
      message: 'Image updted successfully!!',
      data: updatedImage,
    });
  }

  async addProductImage(
    id: number,
    files: Express.Multer.File[],
    req: Request,
    res: Response,
  ) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image file is required');
    }

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const imageUrl = await this.uploadImage.uploadImage(file);
        if (!imageUrl) {
          throw new BadRequestException('Image uploading error!!');
        }
        return imageUrl;
      }),
    );

    if (!imageUrls) {
      throw new BadRequestException('Image uploading failed!!');
    }

    const currentProduct = await this.prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        image: true,
      },
    });

    if (!currentProduct) {
      throw new NotFoundException('Product not found!!');
    }

    const existingImages = currentProduct.image || [];
    //If imageurl single chha vane array ma wrap garne else leave as it is.
    const updatedImages = [
      ...existingImages,
      ...(Array.isArray(imageUrls) ? imageUrls : [imageUrls]),
    ];

    const updatedProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        image: updatedImages,
      },
    });

    return res.status(200).json({
      message: 'Image added successfully!!',
      data: updatedProduct,
    });
  }

  async deleteImages(id: number, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authoized!!');
    }

    const currentProduct = await this.prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        image: true,
      },
    });

    if (!currentProduct) {
      throw new NotFoundException('Product of given id not found!!');
    }

    // currentProduct.image =undefined;

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        image: [],
      },
    });

    return res.status(200).json({
      data: updatedProduct,
    });
  }
}
