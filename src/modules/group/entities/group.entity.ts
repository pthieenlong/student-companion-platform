import User from "../../user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { GroupUser } from "./groupUser.entity";

@Entity()
export default class Group {
  @PrimaryColumn({ type: 'uuid'})
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;
  
  @Column({ type: 'text', nullable: true })
  thumbnail: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  createdBy: string

  @OneToMany(() => GroupUser, (groupUser) => groupUser.group, { nullable: true })
  members: GroupUser[];

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updatedAt: string;
}