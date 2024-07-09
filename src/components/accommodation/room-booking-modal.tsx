"use client";

import { IAccommodation, IRoom } from "@/models/accommodation.model";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { checkDateOverlap, formatPrice, formatRoomSize } from "@/util/format";
import { amenitieIcon } from "@/util/amenities";
import DateRangePicker from "./date-range-picker";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import Loader from "../ui/loader";
import { useToast } from "../ui/use-toast";
import { createBooking } from "@/actions/booking";
import { IUser } from "@/models/user.model";
import { useRouter } from "next/navigation";

export default function RoomBookingModal({
  room,
  open,
  setOpen,
  accommodation,
  user,
}: {
  room: IRoom;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  accommodation: IAccommodation;
  user: IUser;
}) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(room.pricePerNight);

  const [error, setError] = useState({ status: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setError({ status: false, message: "" });
      setDate(undefined);
      setDays(1);
    }
  }, [open]);

  useEffect(() => {
    if (date && date.from && date.to) {
      setError((prev) => ({ ...prev, status: false, message: "" }));
      const dayCount = differenceInCalendarDays(date.to, date.from);
      setDays(dayCount);

      if (dayCount && room.pricePerNight) {
        setTotalPrice(dayCount * room.pricePerNight);
      } else {
        setTotalPrice(room.pricePerNight);
      }
    }
  }, [date, room.pricePerNight]);

  const handleSelectDate = (range: DateRange | undefined) => {
    if (
      range?.from &&
      range.to &&
      range.from.getTime() === range.to.getTime()
    ) {
      setDate(undefined);
    } else {
      setDate(range);
    }
  };

  const handleBooking = async () => {
    if (!user.email) {
      return router.push("/account/signup");
    }
    if (!date?.from || !date.to) {
      setError((prev) => ({
        ...prev,
        status: true,
        message: "Please select a date",
      }));
      return;
    }
    const roomBookingDates = accommodation.bookings?.map((booking) => ({
      startDate: booking.startDate,
      endDate: booking.endDate,
    }));
    const isDateOverlap = checkDateOverlap(
      date.from,
      date.to,
      roomBookingDates!
    );
    if (isDateOverlap) {
      setError((prev) => ({
        ...prev,
        status: true,
        message:
          "The selected dates for your booking overlap with an existing reservation",
      }));
      return;
    }
    setIsLoading(true);
    try {
      await createBooking(date, accommodation, room);
      setOpen(false);
      toast({
        description:
          "Your booking is saved! Please complete the payment to confirm.",
        className: "bg-green-600 text-white",
        duration: 3000,
      });
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        description: error.message,
        duration: 3000,
      });
    }
  };

  const disabledDates = () => {
    let dates: Date[] = [];

    const roomBookings = accommodation.bookings?.filter(
      (booking) => booking.roomId === room._id
    );

    roomBookings?.forEach((booking) => {
      const range = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });

      dates = [...dates, ...range];
    });
    return dates;
  };

  return (
    <>
      <Dialog modal={false} open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 flex flex-col xl:flex-row justify-between xl:max-w-screen-xl h-[70%] md:max-w-screen-md">
          <div className="xl:w-2/3 w-full xl:h-auto h-[350px] relative">
            <Image
              className="object-cover"
              fill
              src={room.image?.url!}
              alt={room.name!}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <ScrollArea className="xl:w-1/3 xl:p-3 xl:pl-1 xl:py-4 px-4 pb-4">
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <hr className="my-3" />
            <p className="text-lg mb-2">Features</p>
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
            <p className="my-3 flex items-center font-normal text-sm">
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
            <p className="my-3 flex items-center font-normal text-sm">
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
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </span>
              {room.maxGuest} Guest{room.maxGuest! > 1 && "s"}
            </p>
            <p className="flex items-center font-normal text-sm">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.0"
                  viewBox="0 0 50 50"
                  preserveAspectRatio="xMidYMid meet"
                  className="size-6"
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
              {room.bathRoomCount} Bathroom{room.bathRoomCount! > 1 && "s"}
            </p>
            <hr className="my-3" />
            <div>
              <p className="text-lg mb-2">Amenities</p>
              <div className="grid grid-cols-2">
                {accommodation.amenities?.map((amen) => (
                  <div className="flex items-center mb-2" key={amen}>
                    <p className="mr-2">{amenitieIcon(amen)}</p>
                    <p className="font-normal text-sm">{amen}</p>
                  </div>
                ))}
              </div>
            </div>
            <hr className="my-3" />
            <h1 className="text-right">
              Room price:
              <span className="font-bold text-xl">
                {" "}
                {formatPrice(room.pricePerNight as number)}
              </span>
              <span className="text-xs">/24hrs</span>
            </h1>
            <hr className="my-3" />
            <p className={"mb-3 mt-8 text-sm"}>
              Select days that you will spend in this room
            </p>
            <DateRangePicker
              date={date}
              onSelect={handleSelectDate}
              disabledDates={disabledDates()}
              isError={error.status}
            />
            {error.status && (
              <p className="text-destructive mt-2 text-sm font-semibold">
                {error.message}
              </p>
            )}
            <h1 className="text-center mt-5">
              Total price:
              <span className="font-bold text-xl">
                {" "}
                {formatPrice(totalPrice as number)}
              </span>{" "}
              for{" "}
              <span>
                {days} Day{days > 1 && "s"}
              </span>
            </h1>
            <Button onClick={handleBooking} className="w-full mt-5">
              {isLoading ? <Loader /> : "Book now"}
            </Button>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        ></div>
      )}
    </>
  );
}
