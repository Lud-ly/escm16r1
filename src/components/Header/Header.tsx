"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "../Sections/components/Navigation";

export const Header = () => {
  const handleLogoClick = () => {
    localStorage.removeItem("hasShownSplash");
  };

  return (
    <div
      className="flex flex-row justify-between items-center p-5"
    >
      <Link href="/" onClick={handleLogoClick}>
        <Image
          src="/images/logo.png"
          alt="logo escm"
          width={70}
          height={70}
          priority
        />
      </Link>
      <Navigation />
    </div>
  );
};
