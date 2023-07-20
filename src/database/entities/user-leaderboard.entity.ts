import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class UserLeaderboard {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    summonerName: string;

    @Column({ type: 'float' })
    winRate: number;

    @Column()
    leaguePoints: number;

    @Column()
    summonerRegion: string;
}