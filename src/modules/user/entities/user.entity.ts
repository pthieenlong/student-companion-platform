import School from "../../school/entities/school.entity";
import { Active, AuthenticateToken, Role } from "../../../shared/enum/EUser";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { GroupUser } from "../../group/entities/groupUser.entity";
import Note from "../../note/entities/note.entity";
import React from "../../react/entities/react.entity";
import FileEntity from "src/modules/file/entities/file.entity";

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
  
  @OneToOne(() => FileEntity, (file) => file.userAvatar, { nullable: true, cascade: true })
  @JoinColumn({ name: 'userAvatar' })
  avatar: FileEntity;
  
  @OneToOne(() => FileEntity,(file) => file.userThumbnail,  { nullable: true, cascade: true })
  @JoinColumn({ name: 'userThumbnail' })
  thumbnail: FileEntity;

  @OneToMany(() => Note, (note) => note.createdBy)
  notes: Note[];
  
  @OneToMany(() => React, (react) => react.user)
  reacts: React[]

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updated_at: string;
}