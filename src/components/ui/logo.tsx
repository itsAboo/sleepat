"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.svg";
import logoDark from "../../../public/logo-dark.svg";
import { useEffect, useState } from "react";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) return <div></div>;

  return (
    <Link href="/" className="h-full">
      <Image
        src={resolvedTheme === "light" ? logo : logoDark}
        alt="logo"
        priority
        className="h-full w-full"
      />
    </Link>
  );
}
