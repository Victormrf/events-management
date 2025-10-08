import { Address } from "./address";
import { User } from "./user";

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  maxAttendees?: number;
  imageUrl?: string;
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
  image?: FileList;
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
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}
