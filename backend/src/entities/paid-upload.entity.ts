import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import { User } from "./user.entity";
import { Company } from "./company.entity";
import { AdPlacement } from "./ad-placement.entity";
import { BaseEntity } from "./base";
import { generateOrderCode } from "../utils/orderCode";

@Entity("paid_uploads")
export class PaidUpload extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId: string;

  @Column({ name: "company_id", type: "char", length: 36 })
  companyId: string;

  @Column({
    name: "upload_type",
    type: "enum",
    enum: [
      "banner",
      "brand",
      "product_service",
      "sponsored_article",
      "push_notification",
      "featured_listing",
      "event_sponsor",
      "training_sponsor",
      "resource_sponsor",
    ],
  })
  uploadType: string;

  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ name: "image_url", type: "varchar", length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ name: "target_url", type: "varchar", length: 500, nullable: true })
  targetUrl: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  placement: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ name: "start_date", type: "date", nullable: true })
  startDate: Date | null;

  @Column({ name: "end_date", type: "date", nullable: true })
  endDate: Date | null;

  @Column({
    type: "enum",
    enum: [
      "draft",
      "pending_payment",
      "pending_review",
      "revision_required",
      "scheduled",
      "published",
      "expired",
      "rejected",
    ],
    default: "draft",
  })
  status: string;

  @Column({ name: "admin_notes", type: "text", nullable: true })
  adminNotes: string | null;

  @Column({ name: "seo_title", type: "varchar", length: 255, nullable: true })
  seoTitle: string | null;

  @Column({
    name: "meta_description",
    type: "varchar",
    length: 500,
    nullable: true,
  })
  metaDescription: string | null;

  @Column({ name: "alt_text", type: "varchar", length: 255, nullable: true })
  altText: string | null;

  @Column({
    name: "payment_status",
    type: "enum",
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  })
  paymentStatus: string;

  @Column({ name: "order_code", type: "varchar", length: 30, unique: true })
  orderCode: string;

  @BeforeInsert()
  generateOrderCode() {
    this.orderCode = generateOrderCode("PU");
  }

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Company)
  @JoinColumn({ name: "company_id" })
  company: Company;

  @OneToMany(() => AdPlacement, (adPlacement) => adPlacement.paidUpload)
  adPlacements: AdPlacement[];
}
