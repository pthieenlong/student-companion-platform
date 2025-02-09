import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class OtpEntity {
  @PrimaryColumn('uuid', {})
  id: string;

  @Column({ type: 'varchar' }) 
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 6 })
  otp: string;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;
}
