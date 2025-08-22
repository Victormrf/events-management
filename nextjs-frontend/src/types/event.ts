import { Address } from "./address";

export type Event = {
  title: string;
  description: string;
  date: string;
  maxAttendees?: number;
  price?: number;
  address: Address;
};
