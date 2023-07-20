import { Module } from "@nestjs/common";
import { RiotService } from "src/matches/riot.service";
import { PlayersController } from "./players.controller";
import { HttpModule } from "@nestjs/axios";
import { LeaderboardModule } from "src/leaderboard/leaderboard.module";

@Module({
    imports: [HttpModule, LeaderboardModule],
    controllers: [PlayersController],
    providers: [RiotService],
})
export class PlayersModule {}