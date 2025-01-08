import Note from "../../note/entities/note.entity";
import { Column, Entity, PrimaryColumn, ManyToOne } from "typeorm";

@Entity()
export default class FileEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar' })
  fileName: string;

  @Column({ type: 'text' })
  filePath: string;

  @Column({ type: 'varchar', nullable: true })
  mimetype: string;

  @Column( { nullable: true })
  size: number

  // @ManyToOne()

  @ManyToOne(() => Note, (note) => note.files, { onDelete: "CASCADE", nullable: true })
  note: Note;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updated_at: string;
}