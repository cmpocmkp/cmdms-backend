import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { DepartmentType } from './entities/department-type.entity';
import {
  CreateDepartmentDto,
  CreateProvinceDto,
  CreateDistrictDto,
  CreateDepartmentTypeDto,
} from './dto/create-department.dto';
import {
  UpdateDepartmentDto,
  UpdateProvinceDto,
  UpdateDistrictDto,
  UpdateDepartmentTypeDto,
} from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(Province)
    private provincesRepository: Repository<Province>,
    @InjectRepository(District)
    private districtsRepository: Repository<District>,
    @InjectRepository(DepartmentType)
    private departmentTypesRepository: Repository<DepartmentType>,
  ) {}

  // Departments
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    const department = this.departmentsRepository.create(createDepartmentDto);
    return await this.departmentsRepository.save(department);
  }

  async findAllDepartments(): Promise<Department[]> {
    return await this.departmentsRepository.find({
      relations: ['departmentType', 'parent', 'district'],
      order: { name: 'ASC' },
    });
  }

  async findDepartment(id: number): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { id },
      relations: ['departmentType', 'parent', 'district', 'children'],
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async updateDepartment(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findDepartment(id);
    Object.assign(department, updateDepartmentDto);
    return await this.departmentsRepository.save(department);
  }

  async removeDepartment(id: number): Promise<void> {
    const department = await this.findDepartment(id);
    await this.departmentsRepository.remove(department);
  }

  // Provinces
  async createProvince(createProvinceDto: CreateProvinceDto): Promise<Province> {
    const province = this.provincesRepository.create(createProvinceDto);
    return await this.provincesRepository.save(province);
  }

  async findAllProvinces(): Promise<Province[]> {
    return await this.provincesRepository.find({ order: { name: 'ASC' } });
  }

  async findProvince(id: number): Promise<Province> {
    const province = await this.provincesRepository.findOne({ where: { id } });
    if (!province) {
      throw new NotFoundException(`Province with ID ${id} not found`);
    }
    return province;
  }

  async updateProvince(
    id: number,
    updateProvinceDto: UpdateProvinceDto,
  ): Promise<Province> {
    const province = await this.findProvince(id);
    Object.assign(province, updateProvinceDto);
    return await this.provincesRepository.save(province);
  }

  async removeProvince(id: number): Promise<void> {
    const province = await this.findProvince(id);
    await this.provincesRepository.remove(province);
  }

  // Districts
  async createDistrict(createDistrictDto: CreateDistrictDto): Promise<District> {
    const district = this.districtsRepository.create(createDistrictDto);
    return await this.districtsRepository.save(district);
  }

  async findAllDistricts(): Promise<District[]> {
    return await this.districtsRepository.find({
      relations: ['province'],
      order: { name: 'ASC' },
    });
  }

  async findDistrict(id: number): Promise<District> {
    const district = await this.districtsRepository.findOne({
      where: { id },
      relations: ['province'],
    });
    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }
    return district;
  }

  async updateDistrict(
    id: number,
    updateDistrictDto: UpdateDistrictDto,
  ): Promise<District> {
    const district = await this.findDistrict(id);
    Object.assign(district, updateDistrictDto);
    return await this.districtsRepository.save(district);
  }

  async removeDistrict(id: number): Promise<void> {
    const district = await this.findDistrict(id);
    await this.districtsRepository.remove(district);
  }

  // Department Types
  async createDepartmentType(
    createDepartmentTypeDto: CreateDepartmentTypeDto,
  ): Promise<DepartmentType> {
    const departmentType =
      this.departmentTypesRepository.create(createDepartmentTypeDto);
    return await this.departmentTypesRepository.save(departmentType);
  }

  async findAllDepartmentTypes(): Promise<DepartmentType[]> {
    return await this.departmentTypesRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findDepartmentType(id: number): Promise<DepartmentType> {
    const departmentType = await this.departmentTypesRepository.findOne({
      where: { id },
    });
    if (!departmentType) {
      throw new NotFoundException(`Department Type with ID ${id} not found`);
    }
    return departmentType;
  }

  async updateDepartmentType(
    id: number,
    updateDepartmentTypeDto: UpdateDepartmentTypeDto,
  ): Promise<DepartmentType> {
    const departmentType = await this.findDepartmentType(id);
    Object.assign(departmentType, updateDepartmentTypeDto);
    return await this.departmentTypesRepository.save(departmentType);
  }

  async removeDepartmentType(id: number): Promise<void> {
    const departmentType = await this.findDepartmentType(id);
    await this.departmentTypesRepository.remove(departmentType);
  }
}

