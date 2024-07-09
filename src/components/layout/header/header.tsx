import Link from "next/link";
import { Button } from "../../ui/button";

import Logo from "../../ui/logo";
import ThemeButton from "../../ui/theme-button";
import { getUser } from "@/lib/lucia";
import { signout } from "@/actions/auth";
import HeaderDropdown from "./header-dropdown";

export default async function Header() {
  const { user } = await getUser();

  return (
    <header className="border-b flex justify-center sticky top-0 left-0 right-0 z-[666] bg-inherit">
      <nav className="md:container px-2 w-full flex justify-between items-center h-16">
        <Logo />
        <div className="flex items-center">
          <ThemeButton className="mr-3 md:flex hidden" />
          {!user ? (
            <>
              <Button
                asChild
                variant="ghost"
                className="mr-3 hidden md:flex text-primary hover:bg-primary hover:text-secondary"
              >
                <Link href="/account/signin">Sign in</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="hidden md:flex hover:bg-primary hover:text-secondary text-primary border-primary"
              >
                <Link href="/account/signup">Create account</Link>
              </Button>
              <HeaderDropdown className="flex md:hidden" user={null} />
            </>
          ) : (
            <HeaderDropdown user={user} signout={signout} />
          )}
        </div>
      </nav>
    </header>
  );
}
