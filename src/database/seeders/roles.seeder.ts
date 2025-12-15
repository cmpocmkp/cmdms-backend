import { DataSource } from 'typeorm';
import { Role } from '../../modules/roles/entities/role.entity';

export async function seedRoles(dataSource: DataSource): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);

  const roles = [
    {
      id: 1,
      name: 'Admin',
      description: 'System administrator with full access',
      isActive: true,
    },
    {
      id: 2,
      name: 'Department User',
      description: 'Department user with limited access',
      isActive: true,
    },
    {
      id: 3,
      name: 'Data Entry',
      description: 'Data entry operator',
      isActive: true,
    },
    {
      id: 4,
      name: 'CM',
      description: 'Chief Minister',
      isActive: true,
    },
    {
      id: 5,
      name: 'Chief Secretary',
      description: 'Chief Secretary',
      isActive: true,
    },
    {
      id: 6,
      name: 'Cabinet Member',
      description: 'Provincial Cabinet Member',
      isActive: true,
    },
    {
      id: 7,
      name: 'Sectorial Head',
      description: 'Sectorial department head',
      isActive: true,
    },
  ];

  for (const roleData of roles) {
    const existing = await roleRepository.findOne({ where: { id: roleData.id } });
    if (!existing) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`✓ Created role: ${roleData.name}`);
    } else {
      console.log(`- Role already exists: ${roleData.name}`);
    }
  }
}

