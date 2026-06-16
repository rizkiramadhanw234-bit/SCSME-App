import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Admin } from "./admin.entity";
import { BaseEntity } from "./base";

@Entity("admin_logs")
export class AdminLog extends BaseEntity {
  @Column({ name: "admin_id", type: "char", length: 36 })
  adminId: string;

  @Column({ type: "varchar", length: 100 })
  action: string;

  @Column({ name: "target_type", type: "varchar", length: 100 })
  targetType: string;

  @Column({ name: "target_id", type: "char", length: 36 })
  targetId: string;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  // Relations
  @ManyToOne(() => Admin)
  @JoinColumn({ name: "admin_id" })
  admin: Admin;
}
