import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Shell {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', unique: true })
  shellId: number;

  @Index()
  @Column({ type: 'bigint', nullable: true })
  sessionId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ nullable: true })
  query: string;

  @Column({ nullable: true })
  runTime: string;

  @Column({ nullable: true })
  queryType: string;

  @Column({ nullable: true })
  failMessage: string;

  @Column({ nullable: true })
  affectedRows: number;

  @Column({ type: 'json', nullable: true })
  resultTable: object;

  @Column({ nullable: true })
  queryStatus: boolean;
}
