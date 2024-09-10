import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDTO } from './dto/createemployee.dto';
import { UpdateEmployeeDTO } from './dto/updateemployee.dto';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { ImageUploadService } from 'src/global/services/imageupload.service';

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
    private uploadImageService: ImageUploadService,
  ) {}
  async getEmployees() {
    const employees = await this.prisma.employee.findMany();
    if (employees.length === 0) {
      throw new NotFoundException('Employees data not found!!');
    }

    return employees;
  }

  async createEmployee(
    file: Express.Multer.File,
    createempdto: CreateEmployeeDTO,
  ) {
    const empdata: any = {
      ...createempdto,
    };

    const imageurl = await this.uploadImageService.uploadImage(file);

    if (!imageurl) {
      throw new Error('Error uploading image!!');
    }

    const newEmployee = await this.prisma.employee.create({
      data: {
        ...empdata,
        image: imageurl,
      },
    });
    return newEmployee;
  }

  async updateEmployee(
    file: Express.Multer.File,
    id: number,
    updateempdto: UpdateEmployeeDTO,
  ) {
    const employeeAvailable = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employeeAvailable) {
      throw new NotFoundException('Employee data not found!!');
    }

    const updatedata: any = {
      ...updateempdto,
    };

    if (file) {
      const imageurl = await this.uploadImageService.uploadImage(file);
      updatedata.image = imageurl;
    }

    const updatedemployee = await this.prisma.employee.update({
      where: {
        id: employeeAvailable.id,
      },
      data: {
        ...updatedata,
      },
    });

    return updatedemployee;
  }

  async deleteEmployee(id: number) {
    const employeeAvailable = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employeeAvailable) {
      throw new NotFoundException('Employee not found!!');
    }

    await this.prisma.employee.delete({
      where: { id },
    });
    return { message: 'Employee deleted successfully!!' };
  }
}
