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

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;
}
