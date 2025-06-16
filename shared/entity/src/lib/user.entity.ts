import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  username?: string;

  @Column()
  password?: string;

  @Column()
  email?: string;

  @Column('text', { nullable: true })
  publicKey?: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column('datetime', { nullable: true })
  lastLogin?: Date;
}
