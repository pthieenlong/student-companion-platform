import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { SchoolUser } from "./schoolUser.entity";

@Entity()
export default class School {
  @PrimaryColumn('uuid', {})
  id: string;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @OneToMany(() => SchoolUser, (schoolUser) => schoolUser.school, { nullable: true })
  members: SchoolUser[];

  @Column({ type: 'uuid' })
  createdBy: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updated_at: string;
}