import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  username!: string;

  @Column()
  private passwordHash!: string;

  @Column()
  private salt!: string;

  @Column()
  email!: string;

  @Column('text', { nullable: true })
  publicKey?: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column('datetime', { nullable: true })
  lastLogin?: Date;

  private tempPassword?: string;

  setPassword(password: string) {
    this.tempPassword = password;
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.passwordHash;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.tempPassword) {
      const saltRounds = 12;
      this.salt = await bcrypt.genSalt(saltRounds);
      this.passwordHash = await bcrypt.hash(this.tempPassword, this.salt);
      this.tempPassword = undefined;
    }
  }
}
