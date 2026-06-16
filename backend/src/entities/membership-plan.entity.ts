import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Subscription } from "./subscription.entity";
import { BaseEntity } from "./base";

@Entity("membership_plans")
export class MembershipPlan extends BaseEntity {
  @Column({ name: "plan_name", type: "varchar", length: 100 })
  planName: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ name: "duration_days", type: "int", unsigned: true })
  durationDays: number;

  @Column({ type: "text", nullable: true })
  benefits: string | null;

  @Column({ name: "is_active", type: "tinyint", default: 1 })
  isActive: boolean;

  // Relations
  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}
