"use client";

import { IRoom } from "@/models/accommodation.model";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Modal from "../ui/modal";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { deleteRoom } from "@/actions/room";
import EditRoomModal from "./edit-room-modal";

export default function RoomPreviewCard({
  room,
  accId,
}: {
  room: IRoom;
  accId: string;
}) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleDelete = async (accId: string, roomId: string) => {
    setIsLoading(true);
    try {
      await deleteRoom(accId, roomId);
      setIsLoading(false);
      setOpen(false);
      toast({
        description: "Successfully deleted the room.",
        className: "bg-green-600 text-white",
        duration: 3000,
      });
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      setOpen(false);
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  };
  return (
    <>
      <Card className="relative w-full h-[400px] flex flex-col overflow-hidden shadow-md">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute z-50 bottom-1 right-1"
          onClick={() => setOpen(true)}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </span>
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute z-50 bottom-1 right-12"
          onClick={() => setEditOpen(true)}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </span>
        </Button>
        <CardHeader className="relative h-1/2">
          <Image
            className="object-cover"
            src={room.image?.url!}
            alt={room.name!}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </CardHeader>
        <CardContent className="p-2 pl-3 flex flex-col">
          <h1 className="text-lg font-bold">{room.name}</h1>
          <div className="flex flex-col items-center">
            <div className="mt-2 w-full flex justify-between max-w-[80%]">
              <p>Size : {room.size} m²</p>
              <p>Maximum guest : {room.maxGuest}</p>
            </div>
            <div className="mt-2 w-full flex justify-between max-w-[80%]">
              <p>Bed type : {room.bedType}</p>
              <p>Bed : {room.bedCount}</p>
            </div>
            <div className="mt-2 w-full flex justify-between max-w-[80%]">
              <p>Bath room : {room.bathRoomCount}</p>
              {room.feature && <p>Feature : {room.feature}</p>}
            </div>
            <div className="mt-2 w-full flex justify-between max-w-[80%]">
              <p className="max-w-[80%]">Price : {room.pricePerNight}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <EditRoomModal
        room={room}
        accId={accId}
        open={editOpen}
        setOpen={setEditOpen}
      />
      <Modal
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your
            room from our servers."
        open={open}
        setOpen={setOpen}
        action={handleDelete.bind(null, accId, room._id!)}
        isLoading={isLoading}
      />
    </>
  );
}
