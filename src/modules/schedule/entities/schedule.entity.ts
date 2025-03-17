import User from "../../user/entities/user.entity";
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class Schedule {
  @PrimaryColumn('uuid', {})
  id: string;

  @Column({ type: 'timestamp' })
  startedAt: string;

  @Column({ type: 'timestamp' })
  endedAt: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updatedAt: string;
  
  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.schedules)
  @JoinColumn({ name: 'user' })
  createdBy: User;

  @DeleteDateColumn({type: 'timestamp', default: null })
  deleteAt?: string | null;
}  