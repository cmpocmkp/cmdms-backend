import { DataSource } from 'typeorm';
import { Province } from '../../modules/departments/entities/province.entity';
import { District } from '../../modules/departments/entities/district.entity';
import { DepartmentType } from '../../modules/departments/entities/department-type.entity';
import { Department } from '../../modules/departments/entities/department.entity';
import { MeetingType } from '../../modules/meetings/entities/meeting-type.entity';

export async function seedReferenceData(dataSource: DataSource): Promise<void> {
  await seedProvinces(dataSource);
  await seedDistricts(dataSource);
  await seedDepartmentTypes(dataSource);
  await seedDefaultDepartment(dataSource);
  await seedMeetingTypes(dataSource);
}

async function seedProvinces(dataSource: DataSource): Promise<void> {
  const provinceRepository = dataSource.getRepository(Province);

  const provinces = [
    { id: 1, name: 'Khyber Pakhtunkhwa' },
    { id: 2, name: 'Punjab' },
    { id: 3, name: 'Sindh' },
    { id: 4, name: 'Balochistan' },
    { id: 5, name: 'Gilgit-Baltistan' },
  ];

  for (const provinceData of provinces) {
    const existing = await provinceRepository.findOne({ where: { id: provinceData.id } });
    if (!existing) {
      const province = provinceRepository.create(provinceData);
      await provinceRepository.save(province);
      console.log(`✓ Created province: ${provinceData.name}`);
    }
  }
}

async function seedDistricts(dataSource: DataSource): Promise<void> {
  const districtRepository = dataSource.getRepository(District);

  // KP Districts
  const kpDistricts = [
    'Peshawar', 'Mardan', 'Swabi', 'Charsadda', 'Nowshera',
    'Abbottabad', 'Mansehra', 'Haripur', 'Battagram',
    'D.I. Khan', 'Tank', 'Bannu', 'Lakki Marwat',
    'Swat', 'Dir Upper', 'Dir Lower', 'Chitral', 'Malakand',
    'Kohat', 'Hangu', 'Karak', 'Kurram', 'Orakzai',
    'Shangla', 'Buner', 'Kohistan', 'Tor Ghar',
  ];

  for (const districtName of kpDistricts) {
    const existing = await districtRepository.findOne({ where: { name: districtName } });
    if (!existing) {
      const district = districtRepository.create({
        name: districtName,
        provinceId: 1, // Khyber Pakhtunkhwa
      });
      await districtRepository.save(district);
      console.log(`✓ Created district: ${districtName}`);
    }
  }
}

async function seedDepartmentTypes(dataSource: DataSource): Promise<void> {
  const departmentTypeRepository = dataSource.getRepository(DepartmentType);

  const types = [
    { id: 1, name: 'RecordNote' },
    { id: 2, name: 'Board' },
    { id: 3, name: 'Sectorial' },
    { id: 4, name: 'DC Office' },
    { id: 5, name: 'University' },
    { id: 6, name: 'Hospital' },
  ];

  for (const typeData of types) {
    const existing = await departmentTypeRepository.findOne({ where: { id: typeData.id } });
    if (!existing) {
      const type = departmentTypeRepository.create(typeData);
      await departmentTypeRepository.save(type);
      console.log(`✓ Created department type: ${typeData.name}`);
    }
  }
}

async function seedDefaultDepartment(dataSource: DataSource): Promise<void> {
  const departmentRepository = dataSource.getRepository(Department);

  const defaultDept = {
    id: 1,
    name: 'CM Secretariat',
    description: 'Chief Minister Secretariat',
    departmentTypeId: 1,
    active: true,
  };

  const existing = await departmentRepository.findOne({ where: { id: defaultDept.id } });
  if (!existing) {
    const department = departmentRepository.create(defaultDept);
    await departmentRepository.save(department);
    console.log(`✓ Created default department: ${defaultDept.name}`);
  }
}

async function seedMeetingTypes(dataSource: DataSource): Promise<void> {
  const meetingTypeRepository = dataSource.getRepository(MeetingType);

  const types = [
    { id: 1, name: 'Normal' },
    { id: 2, name: 'Cabinet' },
    { id: 3, name: 'PTF' },
    { id: 4, name: 'PMRU' },
    { id: 5, name: 'Board' },
    { id: 6, name: 'Sectorial' },
    { id: 7, name: 'Senate' },
  ];

  for (const typeData of types) {
    const existing = await meetingTypeRepository.findOne({ where: { id: typeData.id } });
    if (!existing) {
      const type = meetingTypeRepository.create(typeData);
      await meetingTypeRepository.save(type);
      console.log(`✓ Created meeting type: ${typeData.name}`);
    }
  }
}

