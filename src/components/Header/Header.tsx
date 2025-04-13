"use client";

import Image from "next/image";
import Link from "next/link";
import SocialMediaLinks from "../Sections/components/SocialMediaLinks";

export function Header() {
  const handleLogoClick = () => {
    localStorage.removeItem("hasShownSplash");
    localStorage.removeItem("preferredCategory");
  };

  return (
    <div
      className="flex flex-row justify-around items-center p-5"
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
      <SocialMediaLinks />
    </div>
  );
};
