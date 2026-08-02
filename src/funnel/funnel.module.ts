import { Module } from '@nestjs/common';
import { FunnelService } from './funnel.service';
import { FunnelController } from './funnel.controller';

@Module({
  providers: [FunnelService],
  controllers: [FunnelController],
  exports: [FunnelService]
})
export class FunnelModule {}