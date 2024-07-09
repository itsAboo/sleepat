import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

export const formatPrice = (price: number) => {
  return "฿" + Math.floor(price).toLocaleString();
};

export const formatAvartarName = (fName: string, lName: string) => {
  return fName.charAt(0).toUpperCase() + lName.charAt(0).toUpperCase();
};

export const formatDate = (data: Date | string) => {
  const date = new Date(data);
  return date.toLocaleDateString();
};

export const formatRoomSize = (size: number) => {
  const ft = size * 10.7639;
  return `${size} m²/${Math.ceil(ft)} ft²`;
};

export const jsonParse = (data: string | undefined) => {
  let parsed;
  if (!data) {
    parsed = undefined;
  } else {
    try {
      parsed = JSON.parse(data);
    } catch (error) {
      parsed = undefined;
    }
  }
  return parsed;
};

type DateRangesType = {
  startDate: Date;
  endDate: Date;
};

export const checkDateOverlap = (
  startDate: Date,
  endDate: Date,
  dateRanges: DateRangesType[]
) => {
  const targetInterval = {
    start: startOfDay(new Date(startDate)),
    end: endOfDay(new Date(endDate)),
  };

  for (const range of dateRanges) {
    const rangeStart = startOfDay(new Date(range.startDate));
    const rangeEnd = endOfDay(new Date(range.endDate));

    if (
      isWithinInterval(targetInterval.start, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      isWithinInterval(targetInterval.end, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      (targetInterval.start < rangeStart && targetInterval.end > rangeEnd)
    ) {
      return true;
    }
  }
  return false;
};
