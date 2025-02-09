import User from "../../user/entities/user.entity";
import FileEntity from "../../file/entities/file.entity";
import { NoteStatus } from "../../../shared/enum/ENote";
import Comment from "../../comment/entites/comment.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import React from "../../react/entities/react.entity";
import Tag from "../../tag/entities/tag.entity";

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
  
  @OneToMany(() => Comment, (comment) => comment.parent, { cascade: true })
  comments: Comment[];
  
  @OneToMany(() => FileEntity, (file) => file.note, { cascade: true })
  files: FileEntity[];
  
  @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column()
  createdByUsername: string;

  @Column({ default: 0 })
  likeCount: number;

  @OneToMany(() => React, (react) => react.note)
  reacts: React[];

  @ManyToMany(() => Tag, (tag) => tag.notes, { onDelete: 'CASCADE' })
  @JoinTable()
  tags: Tag[];

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updatedAt: string;

  @DeleteDateColumn({type: 'timestamp', default: null })
  deleteAt?: string | null;
}