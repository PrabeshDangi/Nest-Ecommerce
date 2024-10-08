import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/createproduct.dto';
import { Request, Response } from 'express';
import { Product, Size } from '@prisma/client';
import { UpdateProductDto } from './dto/updateproduct.dto';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { ImageUploadService } from 'src/global/services/imageupload.service';
import { HelperService } from 'src/common/helper/helper.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ImageService: ImageUploadService,
    private readonly HelperService: HelperService,
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
    const products = await this.prisma.product.findMany({
      include: {
        categories: true,
        banners: {
          select: {
            id: true,
          },
        },
        ratings: {
          select: {
            rating: true,
            comment: true,
          },
        },
      },
    });

    const productsWithRatings = products.map((product) => {
      const ratings = product.ratings;
      const totalRatings = ratings.length;

      const averageRating =
        totalRatings > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
          : 0;

      return {
        ...product,
        totalRatings,
        averageRating: parseFloat(averageRating.toFixed(2)),
      };
    });

    res.json(productsWithRatings);
  }

  async getProduct(id: number, res: Response) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
        banners: {
          select: {
            id: true,
          },
        },
        ratings: {
          select: {
            id: true,
            rating: true,
            comment: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found!!');
    }

    const bannerId = product.banners.length > 0 ? product.banners[0].id : null;

    const responseData = {
      ...product,
      bannerId,
      banners: undefined,
    };
    return res.status(200).json({
      message: 'Product fetched successfully!!',
      data: responseData,
    });
  }

  async getBestSellingProducts(res: Response) {
    const products = await this.prisma.product.findMany({
      orderBy: {
        soldqunatity: 'desc',
      },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        brand: true,
        price: true,
        image: true,
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
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image file is required');
    }

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const imageUrl = await this.ImageService.uploadImage(file);
        if (!imageUrl) {
          throw new BadRequestException('Image uploading error!!');
        }
        return imageUrl;
      }),
    );

    if (!imageUrls) {
      throw new BadRequestException('Image uploading error!!');
    }

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
        sizes: (createproductdto.sizes as Size) || null,
        returnpolicy: createproductdto.returnpolicy,
        description: createproductdto.description,
        brand: createproductdto.brand,
        stock: parseInt(createproductdto.stock as unknown as string),
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

    if (categoryIds && categoryIds.length > 0) {
      updateData.categories = {
        set: categoryIds.map((id) => ({ id })), // Use 'set' to override existing categories
      };
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        categories: true,
      },
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
        const imageUrl = await this.ImageService.uploadImage(file);
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
        const imageUrl = await this.ImageService.uploadImage(file);
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

  async deleteImage(body: { index: number }, id: number, res: Response) {
    const { index } = body;

    if (index === undefined) {
      throw new BadRequestException('Index required!!');
    }

    const currentItem = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true, image: true },
    });

    const availableImageUrl = currentItem.image[index];
    if (!availableImageUrl) {
      throw new NotFoundException('Image not foundd!!');
    }

    const publicId =
      await this.HelperService.extractPublicId(availableImageUrl);

    const imageRemaining = currentItem.image.filter(
      (ImageUrl) => ImageUrl !== availableImageUrl,
    );

    const updatedProduct = await this.prisma.product.update({
      where: { id: currentItem.id },
      data: {
        image: imageRemaining,
      },
    });

    if (!updatedProduct) {
      throw new BadRequestException(
        'Error updating the image of the given product!!',
      );
    }

    const deletedImage = await this.ImageService.deleteImage(publicId);

    if (!deletedImage) {
      return res.status(400).json({
        message: 'Error deletion of the image!!',
      });
    }

    return res.status(200).json({
      message: 'Image deleted successfully!!',
    });
  }
}
