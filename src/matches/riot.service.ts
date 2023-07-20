import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UserLeaderboardService } from 'src/database/user-leaderboard.service';

@Injectable({})
export class RiotService {
  private readonly RIOT_API_KEY: string;
  private readonly REGIONAL_ENDPOINT_URLS: Object;
  private readonly GLOBAL_ENDPOINT_URLS: Object;

  constructor(
    private httpService: HttpService,
    private readonly userLeaderboardService: UserLeaderboardService,
  ) {
    this.RIOT_API_KEY = 'RGAPI-7176412a-2fba-449d-b9ae-537ae7f0ff07';
    this.REGIONAL_ENDPOINT_URLS = {
      NA: 'https://na1.api.riotgames.com',
      BR: 'https://br1.api.riotgames.com',
      EUNE: 'https://eun1.api.riotgames.com',
      EUW: 'https://euw1.api.riotgames.com',
      JP: 'https://jp1.api.riotgames.com',
      KR: 'https://kr.api.riotgames.com',
      LAN: 'https://la1.api.riotgames.com',
      LAS: 'https://la2.api.riotgames.com',
      OCE: 'https://oc1.api.riotgames.com',
      TR: 'https://tr1.api.riotgames.com',
      RU: 'https://ru.api.riotgames.com',
    };
    this.GLOBAL_ENDPOINT_URLS = {
      NA: 'https://americas.api.riotgames.com',
      BR: 'https://americas.api.riotgames.com',
      EUNE: 'https://europe.api.riotgames.com',
      EUW: 'https://europe.api.riotgames.com',
      JP: 'https://asia.api.riotgames.com',
      KR: 'https://asia.api.riotgames.com',
      LAN: 'https://americas.api.riotgames.com',
      LAS: 'https://americas.api.riotgames.com',
      OCE: 'https://americas.api.riotgames.com',
      TR: 'https://europe.api.riotgames.com',
      RU: 'https://europe.api.riotgames.com',
    };
  }

  getAverageCsPerMinuteAndKda(playerMatchArray: Array<any>) {
    let kdaSum = 0;
    let csPerMinuteSum = 0;
    let visionScoreSum = 0;
    let winCount = 0;
    const matchCount = playerMatchArray.length;
    for (const match of playerMatchArray) {
      kdaSum += match.kda;
      csPerMinuteSum += match.csPerMinute;
      visionScoreSum += match.visionScore;
      if (match.win) {
        winCount += 1;
      }
    }
    return {
      averageKda: kdaSum / matchCount,
      averageCsPerMinute: csPerMinuteSum / matchCount,
      averageVisionScore: visionScoreSum / matchCount,
      winRate: winCount / matchCount,
      winCount: winCount,
    };
  }
  async getMatchesInformationfromMatchIds(
    matchIdsArray: Array<any>,
    summonerRegion,
    playerPuuid,
  ) {
    const matchesArray = [];
    for (const matchId of matchIdsArray) {
      const response = await this.httpService
        .get(
          `${this.GLOBAL_ENDPOINT_URLS[summonerRegion]}/lol/match/v5/matches/${matchId}`,
          {
            headers: {
              'X-Riot-Token': this.RIOT_API_KEY,
            },
          },
        )
        .toPromise();
      const match = response.data;
      const playerMatchInfo = match.info.participants.find(
        (participant) => participant.puuid === playerPuuid,
      );
      if (!playerMatchInfo) {
        continue;
      }
      const {
        championName,
        kills,
        assists,
        deaths,
        totalMinionsKilled,
        win,
        visionScore,
      } = playerMatchInfo;
      const gameDurationInMinutes = match.info.gameDuration / 60;
      matchesArray.push({
        championName,
        kda: (kills + assists) / deaths,
        csPerMinute: totalMinionsKilled / gameDurationInMinutes,
        kills,
        assists,
        totalMinionsKilled,
        win,
        visionScore,
      });
    }

    return matchesArray;
  }
  async getSummonerInfo(summonerName: string, summonerRegion) {
    const encodedSummonerName = encodeURIComponent(summonerName);
    const response = await this.httpService
      .get(
        `${this.REGIONAL_ENDPOINT_URLS[summonerRegion]}/lol/summoner/v4/summoners/by-name/${encodedSummonerName}`,
        {
          headers: {
            'X-Riot-Token': this.RIOT_API_KEY,
          },
        },
      )
      .toPromise();
    return response.data;
  }
  async getRecentMatches(
    summonerName: string,
    summonerRegion: string,
    limit: number,
    offset: number,
    queue: number,
  ) {
    const { puuid } = await this.getSummonerInfo(summonerName, summonerRegion);
    const response = await this.httpService
      .get(
        `${this.GLOBAL_ENDPOINT_URLS[summonerRegion]}/lol/match/v5/matches/by-puuid/${puuid}/ids`,
        {
          headers: {
            'X-Riot-Token': this.RIOT_API_KEY,
          },
          params: {
            start: offset,
            count: limit,
            queue: queue,
          },
        },
      )
      .toPromise();
    const matchesArray = await this.getMatchesInformationfromMatchIds(
      response.data,
      summonerRegion,
      puuid,
    );
    return matchesArray;
  }
  async getDetailedPlayerSummary(summonerName: string, summonerRegion, queue) {
    const { id, puuid, profileIconId } = await this.getSummonerInfo(
      summonerName,
      summonerRegion,
    );
    const response = await this.httpService
      .get(
        `${this.REGIONAL_ENDPOINT_URLS[summonerRegion]}/lol/league/v4/entries/by-summoner/${id}`,
        {
          headers: {
            'X-Riot-Token': this.RIOT_API_KEY,
          },
        },
      )
      .toPromise();
    const { rank, leaguePoints, wins } = response.data[0];
    const allMatches = await this.getAllMatchesFromSummonerId(
      puuid,
      summonerRegion,
      queue,
    );

    const matchesArray = await this.getMatchesInformationfromMatchIds(
      allMatches,
      summonerRegion,
      puuid,
    );
    const {
      averageKda,
      averageCsPerMinute,
      averageVisionScore,
      winRate,
      winCount,
    } = this.getAverageCsPerMinuteAndKda(matchesArray);

    await this.userLeaderboardService.create({
      summonerName,
      leaguePoints,
      winRate,
      summonerRegion,
    });
    return {
      summonerName,
      rank,
      leaguePoints,
      wins,
      winRate,
      winCount,
      averageKda: averageKda || 0,
      averageCsPerMinute,
      averageVisionScore,
      profileIconId,
    };
  }
  async getAllMatchesFromSummonerId(
    puuid: string,
    summonerRegion: string,
    queue: number,
  ) {
    const response = await this.httpService
      .get(
        `${this.GLOBAL_ENDPOINT_URLS[summonerRegion]}/lol/match/v5/matches/by-puuid/${puuid}/ids`,
        {
          headers: {
            'X-Riot-Token': this.RIOT_API_KEY,
          },
          params: {
            count: 95,
            queue,
          },
        },
      )
      .toPromise();
    return response.data;
  }
}
