import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base";

@Entity("admins")
export class Admin extends BaseEntity {
  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash: string;

  @Column({
    name: "admin_role",
    type: "enum",
    enum: ["staff", "super_admin"],
    default: "staff",
  })
  adminRole: string;

  @Column({ name: "is_active", type: "tinyint", default: 1 })
  isActive: boolean;

  @Column({ name: "last_login_at", type: "timestamp", nullable: true })
  lastLoginAt: Date | null;
}
