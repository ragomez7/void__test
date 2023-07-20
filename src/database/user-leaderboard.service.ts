import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLeaderboard } from './entities/user-leaderboard.entity';
import { UserLeaderboardDto } from 'src/leaderboard/dto';

@Injectable()
export class UserLeaderboardService {
  constructor(
    @InjectRepository(UserLeaderboard)
    private userLeaderboardRepository: Repository<UserLeaderboard>,
  ) {}

  async create(dto: UserLeaderboardDto) {
    const { summonerName, leaguePoints, winRate, summonerRegion } = dto;

    let userLeaderboardInfo = await this.userLeaderboardRepository.findOne({
      where: { summonerName },
    });

    if (!userLeaderboardInfo) {
      userLeaderboardInfo = new UserLeaderboard();
      userLeaderboardInfo.summonerName = summonerName;
    }

    userLeaderboardInfo.leaguePoints = leaguePoints;
    userLeaderboardInfo.winRate = winRate;
    userLeaderboardInfo.summonerRegion = summonerRegion;

    const result = await this.userLeaderboardRepository.save(
      userLeaderboardInfo,
    );
    return result;
  }
  async getAllFromRegion(summonerName: string, summonerRegion: string) {
    const leaderboard = await this.userLeaderboardRepository.find({
      where: { summonerRegion },
    });
    return leaderboard
  }
}
