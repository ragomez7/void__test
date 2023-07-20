import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { RiotService } from './riot.service';
import { HttpModule } from '@nestjs/axios';
import { LeaderboardModule } from 'src/leaderboard/leaderboard.module';

@Module({
  imports: [HttpModule, LeaderboardModule],
  controllers: [MatchesController],
  providers: [RiotService],
})
export class MatchesModule {}
