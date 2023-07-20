import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RiotService } from './riot.service';
import { GetRecentMatchesDto } from 'src/matches/dto';

@Controller('recent-matches/by-name')
export class MatchesController {
  constructor(private readonly riotService: RiotService) {}

  @Get(':name')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRecentMatches(
    @Query() getRecentMatchesDto: GetRecentMatchesDto,
    @Param('name') summonerName: string,
  ) {
    return await this.riotService.getRecentMatches(
      summonerName,
      getRecentMatchesDto.summonerRegion,
      getRecentMatchesDto.limit,
      getRecentMatchesDto.offset,
      getRecentMatchesDto.queue,
    );
  }
}
