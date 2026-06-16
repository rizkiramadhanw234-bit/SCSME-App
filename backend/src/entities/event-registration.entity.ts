import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "./event.entity";
import { User } from "./user.entity";
import { BaseEntity } from "./base";

@Entity("event_registrations")
export class EventRegistration extends BaseEntity {
  @Column({ name: "event_id", type: "char", length: 36 })
  eventId: string;

  @Column({ name: "user_id", type: "char", length: 36 })
  userId: string;

  @Column({
    name: "ticket_type",
    type: "enum",
    enum: ["standard", "vip"],
    default: "standard",
  })
  ticketType: string;

  @Column({
    name: "payment_status",
    type: "enum",
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  })
  paymentStatus: string;

  @Column({ name: "qr_code", type: "varchar", length: 255, nullable: true })
  qrCode: string | null;

  @Column({
    name: "attendance_status",
    type: "enum",
    enum: ["registered", "attended", "absent"],
    default: "registered",
  })
  attendanceStatus: string;

  @Column({
    name: "certificate_url",
    type: "varchar",
    length: 500,
    nullable: true,
  })
  certificateUrl: string | null;

  // Relations
  @ManyToOne(() => Event)
  @JoinColumn({ name: "event_id" })
  event: Event;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
