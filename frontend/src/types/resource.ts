import { BaseEntity } from "./base";
import { AccessLevel, ResourceType } from "./enums";

export interface Resource extends BaseEntity {
  title: string;
  type: ResourceType;
  accessLevel: AccessLevel;
  price: string;
  fileUrl: string | null;
  coverImage: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
}

export interface CreateResourceFormData {
  title: string;
  type: ResourceType;
  accessLevel: AccessLevel;
  price: string | number;
  fileUrl: File;
  coverImage: File;
  seoTitle?: string;
  metaDescription?: string;
}

export type UpdateResourceFormData = Partial<CreateResourceFormData>;
