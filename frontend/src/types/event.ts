import { BaseEntity } from "./base";
import { EventStatus } from "./enums";

export interface Event extends BaseEntity {
  title: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  price: string;
  capacity: number;
  status: EventStatus | null;
  coverImage: string | null;
  language: string | null;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  price: number;
  capacity: number;
  coverImage?: string;
  language?: string;
}

export interface eventStatus {
  status: EventStatus;
}

export type UpdateEventRequest = Partial<CreateEventRequest>;
