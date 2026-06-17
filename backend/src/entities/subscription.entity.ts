import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { MembershipPlan } from "./membership-plan.entity";
import { BaseEntity } from "./base";

@Entity("subscriptions")
export class Subscription extends BaseEntity {
  @Column({ name: "user_id", type: "char", length: 36 })
  userId: string;

  @Column({ name: "plan_id", type: "char", length: 36 })
  planId: string;

  @Column({ name: "start_date", type: "date" })
  startDate: Date;

  @Column({ name: "end_date", type: "date" })
  endDate: Date;

  @Column({
    name: "payment_status",
    type: "enum",
    enum: ["pending", "paid", "failed"],
    default: "pending",
  })
  paymentStatus: string;

  @Column({
    name: "renewal_status",
    type: "enum",
    enum: ["active", "expired", "cancelled"],
    default: "active",
  })
  renewalStatus: string;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => MembershipPlan)
  @JoinColumn({ name: "plan_id" })
  plan: MembershipPlan;
}
