import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ResourcePurchase } from "./resource-purchase.entity";
import { BaseEntity } from "./base";

@Entity("resources")
export class Resource extends BaseEntity {
  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({
    type: "enum",
    enum: ["article", "template", "replay", "course"],
  })
  type: string;

  @Column({
    name: "access_level",
    type: "enum",
    enum: ["public", "member", "paid"],
    default: "public",
  })
  accessLevel: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ name: "file_url", type: "varchar", length: 500, nullable: true })
  fileUrl: string | null;

  @Column({ name: "cover_image", type: "varchar", length: 500, nullable: true })
  coverImage: string | null;

  @Column({ name: "seo_title", type: "varchar", length: 255, nullable: true })
  seoTitle: string | null;

  @Column({
    name: "meta_description",
    type: "varchar",
    length: 500,
    nullable: true,
  })
  metaDescription: string | null;

  // Relations
  @OneToMany(() => ResourcePurchase, (purchase) => purchase.resource)
  purchases: ResourcePurchase[];
}
