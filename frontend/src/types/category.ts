import { BaseEntity } from "./base";

export interface Category extends BaseEntity {
  name: string;
  slug: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}
