import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { MatchesModule } from './matches/matches.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './players/players.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { UserLeaderboard } from './database/entities/user-leaderboard.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MatchesModule,
    PlayersModule,
    LeaderboardModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      // url: 'postgres://wnhgiyry:7GYgfg7reb2C0Cg8C8rrozrH5G7Wt6q8@stampy.db.elephantsql.com/wnhgiyry',
      url: process.env.DB_URI,
      entities: [UserLeaderboard],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
