import Note from "../../note/entities/note.entity";
import { Column, Entity, ManyToMany, PrimaryColumn, Unique } from "typeorm";

@Entity()
export default class Tag {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ unique: true, type: 'varchar', length: '30' })
  name: string;

  @Column({ unique: true, type: 'varchar', length: '30' })
  slug: string;

  @ManyToMany(() => Note, (note) => note.tags)
  notes: Note[];
  
  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  created_at: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updated_at: string;
}