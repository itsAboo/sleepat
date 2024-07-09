"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import { formatPrice } from "@/util/format";
import { IAccommodation } from "@/models/accommodation.model";
import getLocation from "@/util/get-location";

export default function AccommodationCard(props: IAccommodation) {
  const { getCountryByCode, getStateByCode } = getLocation();
  const location = () => {
    let country;
    let state;
    if (props.country) {
      country = getCountryByCode(props.country)?.name ?? props.country;
    }
    if (props.country && props.state) {
      state = getStateByCode(props.country, props.state)?.name ?? props.state;
    }
    return (
      <p className="flex items-end justify-start flex-wrap text-primary text-xs mt-1 font-bold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        <span className={state ? "mr-1" : undefined}>
          {state ? state + "," : null}
        </span>
        <span>{country || null}</span>
      </p>
    );
  };

  return (
    <Card className="w-full sm:h-[220px] flex sm:flex-row flex-col overflow-hidden cursor-pointer shadow-md">
      <CardHeader className="relative h-[250px] sm:h-auto sm:w-1/2">
        <Image
          className="object-cover"
          src={props.image?.url || ""}
          alt={props.name!}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </CardHeader>
      <CardContent className="p-2 pl-3 sm:w-1/2 flex flex-col justify-between text-sm">
        <div>
          <p className="text-lg font-bold leading-tight">{props.name}</p>
          {location()}
          <p className="mt-2">
            {props.description?.length! > 79
              ? props.description?.slice(0, 80) + "..."
              : props.description}
          </p>
        </div>
        <p className="self-end">
          <span className="font-bold text-lg text-primary">
            {formatPrice(props.minPricePerNight || 0)}
          </span>{" "}
          / 24hrs
        </p>
      </CardContent>
    </Card>
  );
}
