import Note from "../../note/entities/note.entity";
import { Column, Entity, PrimaryColumn, ManyToOne } from "typeorm";

@Entity()
export default class File {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text' })
  fileUrl: string;

  @ManyToOne(() => Note, (note) => note.files)
  note: Note;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updated_at: string;
}