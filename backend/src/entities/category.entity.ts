import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base";
import { Company } from "./company.entity";

@Entity("categories")
export class Category extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  slug: string;

  @Column({ name: "is_active", type: "tinyint", default: 1 })
  isActive: boolean;

  // Relations
  @OneToMany(() => Company, (company) => company.category)
  companies: Company[];
}
