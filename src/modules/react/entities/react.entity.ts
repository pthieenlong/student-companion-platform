import Note from "../../note/entities/note.entity";
import User from "../../user/entities/user.entity";
import {  Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";

@Entity()
@Unique(['user', 'note'])
export default class React {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => User, (user) => user.reacts)
  user: User;

  @ManyToOne(() => Note, (note) => note.reacts)
  note: Note;

}