"use client";

import { IBooking } from "@/models/booking.model";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { formatDate, formatPrice, formatRoomSize } from "@/util/format";
import { amenitieIcon } from "@/util/amenities";
import { useToast } from "../ui/use-toast";
import { cancelBooking, confirmPaid } from "@/actions/booking";
import { useState } from "react";
import Modal from "../ui/modal";

export default function BookingCard({ booking }: { booking: IBooking }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [action, setAction] = useState<"pay" | "cancel">("pay");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = (action: "pay" | "cancel") => {
    setAction(action);
    if (action === "pay") {
      setTitle(
        `Would you like to proceed with the payment of ${formatPrice(
          booking.totalPrice
        )}?`
      );
      setDesc(
        "Please review your booking details and click 'Yes' to proceed with the payment."
      );
    }
    if (action === "cancel") {
      setTitle("Are you absolutely sure?");
      setDesc(
        "This action cannot be undone. This will permanently delete this booking from our servers"
      );
    }
    setOpen(true);
  };

  const handleSubmit = async (action: "pay" | "cancel") => {
    if (action === "pay") {
      if (booking.status === "Paid") {
        return;
      }
      setIsLoading(true);
      try {
        await confirmPaid(booking._id);
        toast({
          description: "Successfully confirm booking.",
          className: "bg-green-600 text-white",
          duration: 3000,
        });
      } catch (error: any) {
        console.log(error);
        toast({
          variant: "destructive",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
    if (action === "cancel") {
      setIsLoading(true);
      try {
        await cancelBooking(booking._id, booking.accommodation._id!);
        toast({
          description: "Successfully canceled the booking.",
          className: "bg-green-600 text-white",
          duration: 3000,
        });
      } catch (error: any) {
        console.log(error);
        toast({
          variant: "destructive",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
    setOpen(false);
  };
  return (
    <>
      <Card className="xl:flex-row flex flex-col min-h-48 overflow-hidden">
        <CardHeader className="relative xl:h-auto h-56 xl:w-1/5 ">
          <Image
            className="object-cover"
            fill
            src={booking.room.image?.url!}
            alt={booking.room.name!}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </CardHeader>
        <CardContent className="p-4 xl:flex-row flex flex-col xl:justify-between w-full">
          <div className="flex flex-col justify-between pr-4 xl:w-[25%]">
            <div>
              <h1 className="font-bold text-lg">
                {booking.accommodation.name}
              </h1>
              <h2>{booking.room.name}</h2>
            </div>
            <div className="text-sm my-3 xl:my-0">
              <p>
                Check-in:{" "}
                <span className="text-base font-bold">
                  {formatDate(booking.startDate)}
                </span>
              </p>
              <p>
                Check-out:{" "}
                <span className="text-base font-bold">
                  {formatDate(booking.endDate)}
                </span>
              </p>
            </div>
          </div>
          <div className="flex xl:flex-row xl:w-1/2 flex-col gap-4">
            <div className="xl:px-4 xl:border-r border-b xl:border-b-0 pb-4 xl:w-full">
              <p className="flex items-center font-normal text-sm">
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                </span>
                Room size: {formatRoomSize(booking.room.size!)}
              </p>
              <p className="my-3 flex items-center font-normal text-sm">
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </span>
                {booking.room.feature}
              </p>
              <p className="flex items-center font-normal text-sm">
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50.0 50.0"
                    className="size-5"
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
                {`${booking.room.bedCount} ${booking.room.bedType}`} bed
              </p>
              <p className="my-3 flex items-center font-normal text-sm">
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                    />
                  </svg>
                </span>
                {booking.room.maxGuest} Guest{booking.room.maxGuest! > 1 && "s"}
              </p>
              <p className="flex items-center font-normal text-sm">
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.0"
                    viewBox="0 0 50 50"
                    preserveAspectRatio="xMidYMid meet"
                    className="size-5"
                  >
                    <g
                      transform="translate(0,50) scale(0.1,-0.1)"
                      fill="currentColor"
                      stroke="none"
                    >
                      <path d="M380 458 c-53 -57 -52 -68 10 -68 55 0 64 14 30 45 -15 14 -17 21 -9 32 14 16 41 17 57 1 7 -7 12 -44 12 -95 l0 -83 -240 0 -240 0 0 -29 c0 -16 6 -31 15 -35 10 -3 15 -19 15 -46 0 -51 22 -95 58 -114 23 -12 25 -15 10 -21 -10 -4 -18 -11 -18 -16 0 -14 26 -10 40 6 18 22 242 22 260 0 14 -16 40 -20 40 -6 0 5 -8 12 -17 16 -16 6 -14 9 9 21 36 19 58 63 58 114 0 27 5 43 15 46 12 5 15 28 15 120 0 101 -2 116 -20 134 -30 30 -57 24 -100 -22z m25 -38 c3 -5 -3 -10 -15 -10 -12 0 -18 5 -15 10 3 6 10 10 15 10 5 0 12 -4 15 -10z m75 -160 c0 -6 -83 -10 -230 -10 -147 0 -230 4 -230 10 0 6 83 10 230 10 147 0 230 -4 230 -10z m-30 -81 c0 -43 -5 -55 -29 -80 l-29 -29 -142 0 -142 0 -29 29 c-24 25 -29 37 -29 80 l0 51 200 0 200 0 0 -51z" />
                      <path d="M350 370 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                      <path d="M380 370 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                      <path d="M410 370 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                      <path d="M340 340 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                      <path d="M380 340 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                      <path d="M420 340 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                      <path d="M330 310 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                      <path d="M380 310 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                      <path d="M430 310 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0 -10 -4 -10 -10z" />
                    </g>
                  </svg>
                </span>
                {booking.room.bathRoomCount} Bathroom
                {booking.room.bathRoomCount! > 1 && "s"}
              </p>
            </div>
            <div className="xl:w-full xl:px-4">
              <div className="grid grid-cols-2 gap-x-2 border-b pb-4 xl:border-b-0 xl:pb-0 xl:mb-0 mb-4">
                {booking.accommodation.amenities?.map((amen) => (
                  <div className="flex items-center mb-2 " key={amen}>
                    <p className="mr-2">{amenitieIcon(amen)}</p>
                    <p className="font-normal text-sm">{amen}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col text-end gap-2 xl:justify-between xl:items-end xl:border-l  pb-3 xl:w-[22%]">
            <div className="flex flex-col xl:items-end">
              <p
                className={`${
                  booking.status === "Paid"
                    ? "text-green-500"
                    : "text-destructive"
                } mb-2`}
              >
                {booking.status}
              </p>
              <div className="flex gap-2 justify-end">
                <p className="flex items-center">
                  <span className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                      />
                    </svg>
                  </span>
                  guest {booking.room.maxGuest}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                      />
                    </svg>
                  </span>
                  night {booking.nightStaying}
                </p>
              </div>
            </div>
            <div>
              <p>
                THB{" "}
                <span className="font-bold text-lg text-primary">
                  {booking.totalPrice.toLocaleString()}
                </span>
              </p>
            </div>
            <div>
              {booking.status === "Not paid" ? (
                <>
                  <Button
                    onClick={() => handleOpenModal("cancel")}
                    className="mr-3"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleOpenModal("pay")}
                    className="px-6"
                  >
                    Pay
                  </Button>
                </>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="xl:visible hidden text-right text-sm italic font-light -mt-3">
        created at {formatDate(booking.createdAt)}
      </p>
      <Modal
        open={open}
        action={handleSubmit.bind(null, action)}
        setOpen={setOpen}
        title={title}
        description={desc}
        isLoading={isLoading}
      />
    </>
  );
}
