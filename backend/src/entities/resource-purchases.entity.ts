import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Resource } from "./resource.entity";
import { User } from "./user.entity";
import { BaseEntity } from "./base";

@Entity("resource_purchases")
export class ResourcePurchases extends BaseEntity {
  @Column({ name: "resource_id", type: "char", length: 36 })
  resourceId: string;

  @Column({ name: "user_id", type: "char", length: 36 })
  userId: string;

  @Column({
    name: "payment_status",
    type: "enum",
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  })
  paymentStatus: string;

  // Relations
  @ManyToOne(() => Resource)
  @JoinColumn({ name: "resource_id" })
  resource: Resource;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
