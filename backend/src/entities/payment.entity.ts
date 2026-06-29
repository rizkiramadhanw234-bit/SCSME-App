import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { User } from "./user.entity";
import { BaseEntity } from "./base";
import { generateOrderCode } from "../utils/orderCode";

@Entity("payments")
export class Payment extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId: string;

  @Column({
    name: "order_type",
    type: "enum",
    enum: ["membership", "event", "resource", "paid_upload"],
  })
  orderType: string;

  @Column({ name: "order_id", type: "char", length: 36 })
  orderId: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({
    name: "payment_status",
    type: "enum",
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  })
  paymentStatus: string;

  @Column({ name: "invoice_url", type: "varchar", length: 500, nullable: true })
  invoiceUrl: string | null;

  @Column({ name: "proof_url", type: "varchar", length: 500, nullable: true })
  proofUrl: string | null;

  @Column({ name: "payment_code", type: "varchar", length: 30, unique: true })
  paymentCode: string;

  @BeforeInsert()
  generateOrderCode() {
    this.paymentCode = generateOrderCode("PAY");
  }

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
