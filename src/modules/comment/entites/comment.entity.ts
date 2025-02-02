import Note from "../../note/entities/note.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export default class Comment {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'uuid'})
  createdBy: string;

  @Column({ type: 'boolean', default: false })
  isReply: boolean;

  @Column({ type: 'uuid', nullable: true })
  replyTo: string;

  @ManyToOne(() => Note, (note) => note.comments, { onDelete: "CASCADE" })
  parent: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updated_at: string;
}