import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Check API and database health status' })
  async check() {
    let dbStatus = 'UP';
    try {
      // Run a simple query to verify database connection
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      dbStatus = 'DOWN';
    }

    const healthReport = {
      status: dbStatus === 'UP' ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus,
        },
      },
    };

    if (dbStatus === 'DOWN') {
      throw new ServiceUnavailableException(healthReport);
    }

    return healthReport;
  }
}
