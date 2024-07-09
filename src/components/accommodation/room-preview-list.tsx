"use client";

import { IAccommodation } from "@/models/accommodation.model";
import RoomPreviewCard from "./room-preview-card";

export default function RoomPreviewList({
  accommodation,
}: {
  accommodation: IAccommodation;
}) {
  return (
    <div className="w-full pb-5">
      <h1 className="text-xl font-bold mb-5">Your rooms</h1>
      {accommodation.rooms?.length! > 0 ? (
        <div className="mb-5 grid xl:grid-cols-3 md:grid-cols-2  gap-6">
          {accommodation.rooms?.map((room) => (
            <RoomPreviewCard
              accId={accommodation._id!}
              key={room._id}
              room={room}
            />
          ))}
        </div>
      ) : (
        <p className="mb-5 font-light">empty list.</p>
      )}
    </div>
  );
}
