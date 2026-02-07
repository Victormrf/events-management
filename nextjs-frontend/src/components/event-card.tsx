"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { Event } from "@/types/event";
import { useAuth } from "@/context/auth-provider";
import toast from "react-hot-toast";
import { EventRegistrationModal } from "./event-registration-modal";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

type EventCardProps = {
  event: Event;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  isDimmed: boolean;
};

export function EventCard({
  event,
  isExpanded,
  onExpand,
  onCollapse,
  isDimmed,
}: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price.toFixed(2)}`;
  };

  const formatAddress = (address: typeof event.address) => {
    return `${address.city}, ${address.state}`;
  };

  const formatFullAddress = (address: typeof event.address) => {
    const parts = [
      address.street,
      address.neighborhood,
      address.city,
      address.state,
      address.zipCode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne que o card se expanda
    if (isAuthenticated) {
      setIsModalOpen(true);
    } else {
      toast.error("Você precisa estar logado para se inscrever em um evento.", {
        position: "bottom-center",
      });
    }
  };

  return (
    <>
      {/* Overlay de blur quando expandido */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm transition-all"
          onClick={onCollapse}
        />
      )}

      <Card
        className={cn(
          "relative z-50 group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 hover:border-3",
          isDimmed && "opacity-40 blur-[2px] pointer-events-none",
        )}
        onClick={() => (isExpanded ? onCollapse() : onExpand())}
      >
        <CardHeader className="space-y-3">
          <div className="w-full flex justify-center mb-2">
            <Image
              src={event.image ? event.image : "/image-placeholder.png"}
              alt={event.title}
              width={400}
              height={300}
              className="rounded-md object-cover max-h-40 w-full"
              style={{ maxHeight: "240px", minHeight: "180px" }}
              priority={false}
            />
          </div>
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
              {event.title}
            </h3>
            <Badge
              variant={parseFloat(event.price) === 0 ? "secondary" : "default"}
            >
              {formatPrice(parseFloat(event.price))}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(event.date, "PPP")}</span>
              <span className="text-xs">at {format(event.date, "p")}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{formatAddress(event.address)}</span>
            </div>

            {event.maxAttendees && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Max {event.maxAttendees} attendees</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Always visible description preview */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>

          {/* Expanded content */}
          {isExpanded && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              {/* Full description */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Full Description</h4>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>

              {/* Full address */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Location</h4>
                <p className="text-sm text-muted-foreground">
                  {formatFullAddress(event.address)}
                </p>
              </div>

              {/* Event creator */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Organized by</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{event.creator.name}</span>
                </div>
              </div>

              {/* Event details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Created:</span>
                  <p className="text-muted-foreground">
                    {format(event.createdAt, "PP")}
                  </p>
                </div>
                {event.maxAttendees && (
                  <div>
                    <span className="font-medium">Capacity:</span>
                    <p className="text-muted-foreground">
                      {event.maxAttendees} people
                    </p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 hover:cursor-pointer"
                  onClick={handleRegisterClick}
                >
                  Register Now
                </Button>
                <Button
                  variant="outline"
                  className="hover:cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Share
                </Button>
              </div>
            </div>
          )}

          {/* Expand/collapse indicator */}
          <div className="flex items-center justify-center pt-2 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{isExpanded ? "Show less" : "Show more"}</span>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <EventRegistrationModal
        event={event}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
