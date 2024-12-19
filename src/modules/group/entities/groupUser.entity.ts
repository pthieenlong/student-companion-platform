import Group from "./group.entity";
import User from "../../user/entities/user.entity";
import { GroupRole } from "../../../shared/enum/EUser";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";

@Entity()
export class GroupUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (group) => group.members)
  group: Group;

  @ManyToOne(() => User, (user) => user.groupMemberships)
  user: User;

  @Column()
  role: GroupRole;
}