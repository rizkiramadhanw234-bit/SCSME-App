import { Entity, Column, OneToMany } from "typeorm";
import { EventRegistration } from "./event-registration.entity";
import { BaseEntity } from "./base";

@Entity("events")
export class Event extends BaseEntity {
  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ name: "event_date", type: "datetime" })
  eventDate: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  location: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: "int", unsigned: true, default: 0 })
  capacity: number;

  @Column({
    type: "enum",
    enum: ["draft", "published", "cancelled"],
    default: "draft",
  })
  status: string;

  @Column({ name: "cover_image", type: "varchar", length: 500, nullable: true })
  coverImage: string | null;

  @Column({ type: "varchar", length: 10, nullable: true })
  language: string | null;

  // Relations
  @OneToMany(() => EventRegistration, (registration) => registration.event)
  registrations: EventRegistration[];
}
