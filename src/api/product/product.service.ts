import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/createproduct.dto';
import { Request, Response } from 'express';
import { Size } from '@prisma/client';
import { UpdateProductDto } from './dto/updateproduct.dto';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(  private prisma:PrismaService){}

    async getAllProducts(res:Response){
        const products=await this.prisma.product.findMany();

        if(products.length===0){
            throw new NotFoundException("No products found!!");
        }

        return res.status(200).json({
            message:"Products fetched successfully!!",
            count:products.length,
            data:products
        })
    }

    async getProduct(id:number,res:Response){
        const product=await this.prisma.product.findUnique({
            where:{
                id
            }
        })

        if(!product){
            throw new NotFoundException("Product not found!!")
        }

        return res.status(200).json({
            message:"Product fetched successfully!!",
            data:product
        })
    }

    async addProduct(createproductdto: CreateProductDto, req: Request, res: Response){
        const user=req.user as {id:number,email:string};

        if(!user){
            throw new ForbiddenException("User not authorized!!");
        }

        const newProduct=await this.prisma.product.create({
            data:{
                title: createproductdto.title,
                price: createproductdto.price,
                image: createproductdto.image,
                discountprice: createproductdto.discountprice,
                rating: createproductdto.rating,
                discounttag: createproductdto.discounttag,
                sizes: createproductdto.sizes as Size, 
                returnpolicy: createproductdto.returnpolicy,
                description: createproductdto.description,
                brand: createproductdto.brand,
                availability: createproductdto.availability,
                categories: createproductdto.categories && createproductdto.categories.length > 0 ?
                {
                    connect: createproductdto.categories.map(category => ({ id: category.id })),
                }
                : undefined,
            }
        })

        if(!newProduct){
            throw new BadRequestException("Error adding the new product");
        }

        return res.status(201).json({
            message:"Successfully added new product!!",
            data:newProduct
        })
        
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto, req: Request, res: Response) {
        const user = req.user as { id: number, email: string };
    
        if (!user) {
            throw new ForbiddenException("User not authorized!!");
        }
    
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                ...updateProductDto,
                categories: updateProductDto.categories ? {
                    set: updateProductDto.categories.map(category => ({ id: category.id })),
                } : undefined,
            },
        });
    
        return res.status(200).json({
            message: "Product updated successfully!",
            data: updatedProduct,
        });
    }

    async deleteProduct(id:number,req:Request,res:Response){
        const user=req.user;

        if(!user){
            throw new ForbiddenException("User not authorized!!");
        }

        const product=await this.prisma.product.findUnique({
            where:{
                id:id
            }
        })

        if(!product){
            throw new NotFoundException("Prouct not found!!")
        }

        await this.prisma.product.delete({
            where:{
                id
            }
        })

        return res.status(200).json({
            message:"Product deleted successfully!!"
        })
    }
    
}
