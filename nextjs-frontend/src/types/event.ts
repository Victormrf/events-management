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
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
};

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  maxAttendees: number;
  price: number;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface EditFormData {
  title: string;
  description: string;
  date: string;
  maxAttendees: number;
  price: number;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface EventDetailsModalProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: Date;
    maxAttendees: number;
    price: number;
    createdAt: Date;
    address: {
      street: string;
      neighborhood: string | null;
      city: string;
      state: string;
      country: string;
      zipCode: string | null;
    };
    creator: {
      name: string;
      email: string;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
}
