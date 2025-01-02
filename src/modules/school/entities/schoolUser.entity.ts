import User from "../../../modules/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import School from "./school.entity";
import { SchoolRole } from "../../../shared/enum/EUser";

@Entity()
export class SchoolUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => School, (school) => school.members)
  school: School;

  @ManyToOne(() => User)
  user: User;

  @Column()
  role: SchoolRole;
}