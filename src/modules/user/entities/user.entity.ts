import School from "../../school/entities/school.entity";
import { Active, AuthenticateToken, Role } from "../../../shared/enum/EUser";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { GroupUser } from "src/modules/group/entities/groupUser.entity";

@Entity()
export default class User {
  @PrimaryColumn('uuid', {})
  id: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER})
  role: Role;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 12 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 40 })
  fullName: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;
  
  @Column({ type: 'text', nullable: true })
  thumbnail: string;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  major: string;

  @OneToMany(() => School, (school) => school.members, { nullable: true })
  school: School;

  @OneToMany(() => GroupUser, (groupUser) => groupUser.user, { nullable: true })
  groupMemberships: GroupUser[];

  @Column({ type: 'enum', enum: Active, default: Active.UNACTIVE })
  isActive: Active;

  @Column('json', { nullable: true })
  token: AuthenticateToken;
  
  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updated_at: string;
}