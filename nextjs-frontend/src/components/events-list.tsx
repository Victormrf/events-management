"use client"

import { EventCard } from "@/components/event-card"

// Mock data based on the Prisma schema
const mockEvents = [
  {
    id: "1",
    title: "Tech Conference 2024",
    description:
      "Join us for the biggest tech conference of the year featuring industry leaders, innovative workshops, and networking opportunities. Learn about the latest trends in AI, web development, and emerging technologies.",
    date: new Date("2024-03-15T09:00:00"),
    maxAttendees: 500,
    price: 299.99,
    createdAt: new Date("2024-01-15"),
    address: {
      street: "123 Innovation Ave",
      neighborhood: "Tech District",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      zipCode: "94105",
    },
    creator: {
      name: "TechEvents Inc",
      email: "contact@techevents.com",
    },
  },
  {
    id: "2",
    title: "Music Festival Summer",
    description:
      "Experience three days of incredible music with top artists from around the world. Food trucks, art installations, and camping available.",
    date: new Date("2024-06-20T16:00:00"),
    maxAttendees: 10000,
    price: 149.5,
    createdAt: new Date("2024-02-01"),
    address: {
      street: "456 Festival Grounds",
      neighborhood: "Entertainment District",
      city: "Austin",
      state: "TX",
      country: "USA",
      zipCode: "78701",
    },
    creator: {
      name: "Music Fest Organizers",
      email: "info@musicfest.com",
    },
  },
  {
    id: "3",
    title: "Startup Pitch Night",
    description:
      "Watch innovative startups pitch their ideas to investors and industry experts. Network with entrepreneurs and discover the next big thing.",
    date: new Date("2024-04-10T18:30:00"),
    maxAttendees: 200,
    price: 0,
    createdAt: new Date("2024-02-20"),
    address: {
      street: "789 Startup Hub",
      neighborhood: "Business Center",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001",
    },
    creator: {
      name: "Startup Community NYC",
      email: "events@startupnyc.com",
    },
  },
  {
    id: "4",
    title: "Art Gallery Opening",
    description:
      "Exclusive opening of contemporary art exhibition featuring local and international artists. Wine and appetizers included.",
    date: new Date("2024-03-25T19:00:00"),
    maxAttendees: 150,
    price: 25.0,
    createdAt: new Date("2024-02-10"),
    address: {
      street: "321 Gallery Street",
      neighborhood: "Arts Quarter",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      zipCode: "90210",
    },
    creator: {
      name: "Modern Art Gallery",
      email: "curator@modernart.com",
    },
  },
  {
    id: "5",
    title: "Cooking Workshop",
    description:
      "Learn to cook authentic Italian cuisine with professional chef Marco Rossi. All ingredients and equipment provided.",
    date: new Date("2024-04-05T14:00:00"),
    maxAttendees: 20,
    price: 85.0,
    createdAt: new Date("2024-02-25"),
    address: {
      street: "654 Culinary School Rd",
      neighborhood: "Food District",
      city: "Chicago",
      state: "IL",
      country: "USA",
      zipCode: "60601",
    },
    creator: {
      name: "Chef Marco Rossi",
      email: "marco@culinaryschool.com",
    },
  },
  {
    id: "6",
    title: "Marathon Training Camp",
    description:
      "Intensive 3-day training camp for marathon runners. Professional coaching, nutrition guidance, and recovery sessions included.",
    date: new Date("2024-05-15T06:00:00"),
    maxAttendees: 50,
    price: 199.0,
    createdAt: new Date("2024-03-01"),
    address: {
      street: "987 Sports Complex",
      neighborhood: "Athletic Center",
      city: "Denver",
      state: "CO",
      country: "USA",
      zipCode: "80202",
    },
    creator: {
      name: "Elite Running Club",
      email: "training@eliterunning.com",
    },
  },
]

export function EventsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
