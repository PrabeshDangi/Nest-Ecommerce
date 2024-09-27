import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDTO } from './dto/updateemployee.dto';
import { CreateEmployeeDTO } from './dto/createemployee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/api/auth/Guard/Access.guard';
import { RolesGuard } from 'src/api/auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/common/decorator/public.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  async getEmployees() {
    try {
      return await this.employeeService.getEmployees();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createEmployee(
    @UploadedFile() file: Express.Multer.File,
    @Body() createempdto: CreateEmployeeDTO,
  ) {
    try {
      return await this.employeeService.createEmployee(file, createempdto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateEmployee(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateempdto: UpdateEmployeeDTO,
  ) {
    try {
      return await this.employeeService.updateEmployee(file, id, updateempdto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteEmployee(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.employeeService.deleteEmployee(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
