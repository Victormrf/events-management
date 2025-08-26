import { Address } from "./address";
import { User } from "./user";

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  maxAttendees?: number;
  price: string;
  address: Address;
  creator: User;
};

export type CreateEventPayload = {
  title: string;
  description: string;
  date: string;
  maxAttendees?: number;
  price: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
};
