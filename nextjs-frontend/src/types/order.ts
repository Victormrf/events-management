export type Attendee = {
  name: string;
  email: string;
};

export type Order = {
  eventId: string;
  attendees: Attendee[];
};

export type OrderRegistrationResponse = {
  message: string;
  orderId: string;
  registeredAttendees: number;
};
