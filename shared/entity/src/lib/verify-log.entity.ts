import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class VerifyLog {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userId?: number;

  @Column('text')
  data?: string;

  @Column('text')
  signature?: string;

  @Column('text', { nullable: true })
  publicKeyUsed?: string;

  @Column()
  result?: 'valid' | 'invalid';

  @Column('text', { nullable: true })
  reason?: string;

  @CreateDateColumn()
  timestamp?: Date;
}
