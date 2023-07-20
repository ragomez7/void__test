import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { RiotService } from 'src/matches/riot.service';
import { GetPlayerSummaryDto } from './dto'; 

@Controller('players')
export class PlayersController {
  constructor(private readonly riotService: RiotService) {}

  @Get('by-name/:name')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSummonerInfoByName(
    @Param('name') summonerName: string,
    @Query() getPlayerSummaryDto: GetPlayerSummaryDto
  ) {
    return this.riotService.getDetailedPlayerSummary(
      summonerName,
      getPlayerSummaryDto.summonerRegion,
      getPlayerSummaryDto.queue,
    );
  }
}
