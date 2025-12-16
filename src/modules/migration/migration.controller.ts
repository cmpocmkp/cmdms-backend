import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Migration')
@Controller('migration')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Public()
  @Post('legacy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run legacy data migration' })
  async runLegacyMigration() {
    return this.migrationService.runLegacyMigration();
  }
}

