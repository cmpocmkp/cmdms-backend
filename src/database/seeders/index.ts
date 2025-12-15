import { DataSource } from 'typeorm';
import { seedRoles } from './roles.seeder';
import { seedPermissions } from './permissions.seeder';
import { seedReferenceData } from './reference-data.seeder';
import { seedAdminUser } from './admin-user.seeder';

export async function runSeeders(dataSource: DataSource): Promise<void> {
  console.log('🌱 Starting database seeding...\n');

  try {
    console.log('📝 Seeding reference data...');
    await seedReferenceData(dataSource);
    console.log('');

    console.log('👥 Seeding roles...');
    await seedRoles(dataSource);
    console.log('');

    console.log('🔐 Seeding permissions...');
    await seedPermissions(dataSource);
    console.log('');

    console.log('👤 Seeding admin user...');
    await seedAdminUser(dataSource);
    console.log('');

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

