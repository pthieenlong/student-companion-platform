import User from "../../user/entities/user.entity";
import File from "../../file/entities/file.entity";
import { NoteStatus } from "../../../shared/enum/ENote";
import Comment from "../../comment/entites/comment.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export default class Note {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'varchar', length: 150 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  thumbnail: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'enum', enum: NoteStatus, default: NoteStatus.PUBLIC })
  noteStatus: NoteStatus;
  
  @OneToMany(() => Comment, (comment) => comment.parent)
  comments: Comment[];
  
  @Column({ type: 'int', default: 0 })
  react: number;
  
  @OneToMany(() => File, (file) => file.note)
  files: string[];
  
  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column()
  createdByUsername: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updated_at: string;
}