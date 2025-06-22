import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userId!: number;

  @Column()
  chat!: string;

  @Column({ nullable: true })
  streamKey!: string;

  @Column('text', { nullable: true })
  signature!: string;

  @Column('datetime')
  timeStamp!: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;
}

export interface VerifiedChat {
  id: number;
  userId: number;
  chat: string;
  streamKey?: string;
  signature?: string;
  timeStamp: Date;
  createdAt?: Date;
  userPublicKey: string | null;
  valid: boolean;
}

