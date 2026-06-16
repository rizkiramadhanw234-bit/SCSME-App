import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { PaidUpload } from "./paid-upload.entity";
import { BaseEntity } from "./base";

@Entity("ad_placements")
export class AdPlacement extends BaseEntity {
  @Column({ name: "paid_upload_id", type: "char", length: 36 })
  paidUpload_id: string;

  @Column({ type: "varchar", length: 100 })
  page: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  position: string | null;

  @Column({ type: "int", unsigned: true, default: 0 })
  impressions: number;

  @Column({ type: "int", unsigned: true, default: 0 })
  clicks: number;

  @Column({ name: "published_at", type: "timestamp", nullable: true })
  publishedAt: Date | null;

  @Column({ name: "expires_at", type: "timestamp", nullable: true })
  expiresAt: Date | null;

  // Relations
  @ManyToOne(() => PaidUpload)
  @JoinColumn({ name: "paid_upload_id" })
  paidUpload: PaidUpload;
}
