import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base";
import { Company } from "./company.entity";
import { Subscription } from "./subscription.entity";
import { EventRegistration } from "./event-registration.entity";
import { ResourcePurchase } from "./resource-purchase.entity";
import { PaidUpload } from "./paid-upload.entity";
import { Payment } from "./payment.entity";

@Entity("users")
export class User extends BaseEntity {
  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email: string;

  @Column({ type: "varchar", length: 30, nullable: true })
  phone: string | null;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  password: string;

  @Column({
    type: "enum",
    enum: ["guest", "member", "corporate", "sponsor"],
    default: "member",
  })
  role: string;

  @Column({
    type: "enum",
    enum: ["active", "inactive", "suspended"],
    default: "active",
  })
  status: string;

  // Relations
  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => EventRegistration, (registration) => registration.user)
  eventRegistrations: EventRegistration[];

  @OneToMany(() => ResourcePurchase, (purchase) => purchase.user)
  resourcePurchases: ResourcePurchase[];

  @OneToMany(() => PaidUpload, (paidUpload) => paidUpload.user)
  paidUploads: PaidUpload[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
