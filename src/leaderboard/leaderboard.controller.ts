import {  Controller, Get, Param } from "@nestjs/common";
import { UserLeaderboardService } from "src/database/user-leaderboard.service";


@Controller('leaderboard')
export class LeaderboardController {
    constructor(private readonly userLeaderboardService: UserLeaderboardService) {}

    @Get(':summonerName/:summonerRegion')
    async getSummonerLeaderboardPosition(@Param('summonerName') summonerName: string, @Param('summonerRegion') summonerRegion: string) {
        const leaderboard = await this.userLeaderboardService.getAllFromRegion(summonerName, summonerRegion);
        leaderboard.sort((a, b) => b.winRate - a.winRate);
        let positionByWinRate =
          leaderboard.findIndex((item) => item.summonerName === summonerName) +
          1;
        leaderboard.sort((a, b) => b.leaguePoints - a.leaguePoints);
        let positionByLeaguePoints =
          leaderboard.findIndex((item) => item.summonerName === summonerName) +
          1;
        return {
          leaguePoints: {
            top: positionByLeaguePoints,
          },
          winRate: {
            top: positionByWinRate,
          },
        };
    }
}