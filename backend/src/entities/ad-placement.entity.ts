import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { PaidUpload } from "./paid-upload.entity";
import { BaseEntity } from "./base";

@Entity("ad_placements")
export class AdPlacement extends BaseEntity {
  @Column({
    name: "paid_upload_order_code",
    type: "char",
    length: 30,
    unique: true,
  })
  orderCode: string;

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
  @ManyToOne(() => PaidUpload, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "paid_upload_order_code",
    referencedColumnName: "orderCode",
    foreignKeyConstraintName: "paid_upload_order_code_fk",
  })
  paidUpload: PaidUpload;
}
