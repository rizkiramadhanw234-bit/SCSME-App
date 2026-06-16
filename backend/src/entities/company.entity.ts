import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { PaidUpload } from "./paid-upload.entity";
import { BaseEntity } from "./base";
import { Category } from "./category.entity";

@Entity("companies")
export class Company extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId: string;

  @Column({ name: "company_name", type: "varchar", length: 200 })
  companyName: string;

  @Column({ name: "category_id", type: "char", length: 36, nullable: true })
  categoryId: string | null;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ name: "logo_url", type: "varchar", length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  website: string | null;

  @Column({
    name: "verification_status",
    type: "enum",
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  })
  verificationStatus: string;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: "category_id" })
  category: Category | null;

  @OneToMany(() => PaidUpload, (paidUpload) => paidUpload.company)
  paidUploads: PaidUpload[];
}
