import Note from "../../note/entities/note.entity";
import { Column, Entity, PrimaryColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { FileType } from '../../../shared/enum/EFile'; 
import User from "../../user/entities/user.entity";
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

  @Column({ type: 'enum', enum: FileType })
  fileType: FileType 

  @OneToOne(() => User, (user) => user.avatar, { onDelete: "CASCADE", nullable: true})
  @JoinColumn({ name: 'avatar' })
  userAvatar: User;

  @OneToOne(() => User, (user) => user.thumbnail, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: 'thumbnail' })
  userThumbnail: User;

  @ManyToOne(() => Note, (note) => note.files, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: 'noteID' })
  note: Note;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updated_at: string;
}