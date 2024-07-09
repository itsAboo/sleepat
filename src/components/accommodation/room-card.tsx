"use client";

import { IAccommodation, IRoom } from "@/models/accommodation.model";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { formatRoomSize } from "@/util/format";
import { Button } from "../ui/button";
import { useState } from "react";
import RoomBookingModal from "./room-booking-modal";
import { IUser } from "@/models/user.model";

export default function RoomCard({
  room,
  accommodation,
  user,
}: {
  room: IRoom;
  accommodation: IAccommodation;
  user: IUser;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card className="w-full md:h-[200px] flex md:flex-row flex-col  overflow-hidden shadow-md">
        <CardHeader className="relative h-[250px] md:w-1/2">
          <Image
            className="object-cover"
            fill
            src={room.image?.url || ""}
            alt={room.name || ""}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </CardHeader>
        <CardContent className="md:w-1/2 p-0">
          <div className="relative h-full w-full">
            <div className="p-4">
              <p className="font-bold text-lg">{room.name}</p>
              <p className="flex items-center font-normal text-sm">
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                </span>
                Room size: {formatRoomSize(room.size!)}
              </p>
              <p className="my-2 flex items-center font-normal text-sm">
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </span>
                {room.feature}
              </p>
              <p className="flex items-center font-normal text-sm">
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50.0 50.0"
                    className="size-6"
                    stroke="currentColor"
                  >
                    <g
                      transform="translate(0.00,50.00) scale(0.10,-0.10)"
                      fill="currentColor"
                    >
                      <path d="M25 388 c-2 -7 -6 -56 -10 -108 -3 -52 -8 -137 -11 -187 l-6 -93 35 0 c31 0 36 3 39 27 l3 28 175 0 175 0 3 -27 c3 -25 8 -28 39 -28 l35 0 -6 103 c-4 56 -10 145 -14 197 l-7 95 -223 3 c-173 2 -223 0 -227 -10z m435 -78 c0 -58 -3 -68 -15 -64 -9 4 -15 19 -15 35 0 41 -21 47 -180 47 -159 0 -180 -6 -180 -47 0 -16 -6 -31 -15 -35 -12 -4 -15 6 -15 64 l0 70 210 0 210 0 0 -70z m-236 -6 c29 -11 17 -24 -21 -24 -21 0 -55 -4 -75 -9 -33 -8 -38 -7 -38 9 0 10 6 21 13 23 18 8 103 8 121 1z m170 0 c9 -3 16 -14 16 -24 0 -16 -5 -17 -37 -9 -21 5 -55 9 -75 9 -37 0 -51 13 -25 23 18 8 103 8 121 1z m28 -68 c24 -11 40 -28 47 -48 21 -61 31 -58 -219 -58 -250 0 -240 -3 -220 57 20 56 80 73 240 69 85 -2 125 -7 152 -20z m58 -171 c0 -33 -4 -45 -15 -45 -8 0 -15 8 -15 18 0 38 -18 42 -200 42 -182 0 -200 -4 -200 -42 0 -10 -7 -18 -15 -18 -11 0 -15 12 -15 45 l0 45 230 0 230 0 0 -45z" />
                    </g>
                  </svg>
                </span>
                {`${room.bedCount} ${room.bedType}`} bed
              </p>
            </div>
            <Button
              onClick={() => setOpen(true)}
              className="rounded-none md:absolute bottom-0 flex justify-center items-center bg-primary text-white text-sm h-[40px] w-full"
            >
              <p>View detail</p>
            </Button>
          </div>
        </CardContent>
      </Card>
      <RoomBookingModal
        user={user}
        accommodation={accommodation}
        room={room}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
