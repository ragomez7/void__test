import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';
import { UserLeaderboardService } from 'src/database/user-leaderboard.service';
import { UserLeaderboard } from 'src/database/entities/user-leaderboard.entity';


@Module({
  imports: [TypeOrmModule.forFeature([UserLeaderboard])],
  controllers: [LeaderboardController],
  providers: [UserLeaderboardService],
  exports: [UserLeaderboardService],
})
export class LeaderboardModule {}
