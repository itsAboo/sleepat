import { formatAvartarName } from "@/util/format";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import Link from "next/link";
import {
  Calendar,
  Hotel,
  Info,
  LogIn,
  LogOut,
  Plus,
  User,
  User2,
  UserPlus,
} from "lucide-react";
import { IUser } from "@/models/user.model";
import HeaderThemeButton from "./header-theme-button";

export default function HeaderDropdown({
  user,
  signout,
  className,
}: {
  user: IUser | null;
  signout?: () => void;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className} asChild>
        <Button asChild variant="ghost" size="icon">
          <Avatar>
            <AvatarImage />
            <AvatarFallback className="cursor-pointer font-semibold">
              {user ? (
                formatAvartarName(user.firstName, user.lastName)
              ) : (
                <User2 className="size-5" />
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account/profile">
                <User className="size-4 mr-2" />
                <span>My Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account/my-booking">
                <Calendar className="size-4 mr-2" />
                <span>My Booking</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account/accommodation/new">
                <Plus className="size-4 mr-2" />
                <span>Create accommodation</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account/accommodation">
                <Hotel className="size-4 mr-2" />
                <span>My Accommodation</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer md:hidden">
              <HeaderThemeButton />
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <p className="flex items-center">
                <Info className="size-4 mr-2" />
                Help
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <form action={signout}>
                <button className="w-full text-left flex items-center">
                  <LogOut className="size-4 mr-2" />
                  <span>Sign out</span>
                </button>
              </form>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/account/signup">
                <UserPlus className="size-4 mr-2" />
                Create Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/account/signin">
                <LogIn className="size-4 mr-2" />
                Sign in
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer md:hidden">
              <HeaderThemeButton />
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <p className="flex items-center">
                <Info className="size-4 mr-2" />
                Help
              </p>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
