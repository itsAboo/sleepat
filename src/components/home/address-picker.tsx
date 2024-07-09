"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { IState } from "country-state-city";
import getLocation from "@/util/get-location";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddressPicker({
  className,
  onSearch,
}: {
  className?: string;
  onSearch: (key: string, value: string) => void;
}) {
  const [states, setStates] = useState<IState[]>([]);

  const searchParams = useSearchParams();

  const [pickedCountry, setPickedCountry] = useState<string | undefined>(
    searchParams.get("country") as string ?? ""
  );
  const [pickedState, setPickedState] = useState<string | undefined>(
    searchParams.get("state") as string ?? ""
  );

  const { getAllCountries, getCountryStates } = getLocation();

  const countries = getAllCountries();

  const router = useRouter();

  const handleClearFilter = () => {
    setPickedCountry("");
    setPickedState("");
    router.push(window.location.pathname);
  };

  useEffect(() => {
    const countryStates = getCountryStates(pickedCountry as string);
    if (countryStates) {
      setStates(countryStates);
    }
  }, [pickedCountry]);

  const handleValueChange = (key: string, value: string) => {
    if (key === "country") {
      setPickedCountry(value);
    } else if (key === "state") {
      setPickedState(value);
    }
    onSearch(key, value);
  };

  return (
    <div className={`${className} flex items-center`}>
      <div className="mr-3 w-full">
        <Select
          value={pickedCountry}
          onValueChange={(value) => handleValueChange("country", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.isoCode} value={country.isoCode}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mr-3 w-full">
        <Select
          value={pickedState}
          onValueChange={(value) => handleValueChange("state", value)}
          disabled={states.length < 1}
        >
          <SelectTrigger>
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.isoCode} value={state.isoCode}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleClearFilter}>Clear</Button>
    </div>
  );
}
