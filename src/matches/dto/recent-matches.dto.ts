import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class GetRecentMatchesDto {
  @IsNotEmpty({
    message: "Provide a summoner region",
  })
  @IsIn(
    ['NA', 'BR', 'EUNE', 'EUW', 'JP', 'KR', 'LAN', 'LAS', 'OCE', 'TR', 'RU'],
    { message: "This region doesn't exist or we don't yet support it." },
  )
  summonerRegion: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;

  @IsOptional()
  queue?: number;
}
