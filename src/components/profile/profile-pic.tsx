"use client";

import { formatAvartarName } from "@/util/format";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ProfilePic({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  return (
    <Avatar className="lg:w-72 lg:h-72 md:h-52 md:w-52 w-32 h-32">
      <AvatarImage />
      <AvatarFallback className="cursor-pointer">
        <h1 className="text-3xl">{formatAvartarName(firstName, lastName)}</h1>
      </AvatarFallback>
    </Avatar>
  );
}
