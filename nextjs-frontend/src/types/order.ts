import { Event } from "./event";

export type Attendee = {
  id?: string;
  name: string;
  email: string;
};

export type Order = {
  id: string;
  eventId: string;
  totalAmount: number;
  quantity: number;
  status: string;
  createdAt: string;
  event: Event;
  attendees: Attendee[];
};

export type CreateOrderPayload = {
  eventId: string;
  attendees: Attendee[];
};

export type OrderRegistrationResponse = {
  message: string;
  orderId: string;
  registeredAttendees: number;
};

export type OrderSummary = {
  individualPrice?: number;
  quantity?: number;
  totalPrice?: number;
};
