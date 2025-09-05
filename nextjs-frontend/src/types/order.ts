export type Attendee = {
  name: string;
  email: string;
};

export type Order = {
  eventId: string;
  attendees: Attendee[];
};
