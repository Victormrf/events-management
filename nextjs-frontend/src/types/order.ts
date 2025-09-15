export type Attendee = {
  name: string;
  email: string;
};

interface OrderEvent {
  id: string;
  title: string;
  date: string;
  price: string;
}

export type Order = {
  eventId: string;
  totalAmount: number;
  quantity: number;
  status: string;
  event: OrderEvent;
  attendees: Attendee[];
};

export type OrderRegistrationResponse = {
  message: string;
  orderId: string;
  registeredAttendees: number;
};
