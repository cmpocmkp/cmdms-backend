import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { UserType } from '../../common/enums';
import * as bcrypt from 'bcrypt';

export async function seedAdminUser(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  const adminEmail = 'admin@cmdms.gov.pk';
  
  const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const admin = userRepository.create({
      name: 'System Administrator',
      email: adminEmail,
      password: hashedPassword,
      roleId: 1, // Admin role
      departmentId: 1, // Default department (will need to be created)
      type: UserType.SYSTEM,
      isActive: true,
      mustChangePassword: false,
      emailVerifiedAt: new Date(),
    });

    await userRepository.save(admin);
    console.log('✓ Created admin user');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: Admin@123`);
    console.log('  ⚠️  Please change the password after first login!');
  } else {
    console.log('- Admin user already exists');
  }
}

