"use client";

import "./globals.css";
import { Header } from "~/src/components/Header/Header";
import Footer from "~/src/components/Footer/footer";
import BackToTopButton from '../src/components/Sections/components/BackToTopButton';
import BottomNavBar from "~/src/components/Sections/components/BottomNavBar";
import SplashScreen from "~/src/components/Sections/components/SplashScreen";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const isHome = pathName === "/";
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasShownSplash = localStorage.getItem("hasShownSplash");

    if (!hasShownSplash && isHome) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isHome]);

  const handleFinishLoading = () => {
    setIsLoading(false);
    localStorage.setItem("hasShownSplash", "true");
  };

  const navigateWithParams = useCallback((path: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${path}${query}`);
  }, [router, searchParams]);

  return (
    <html lang="en">
      <head />
      <body className="flex flex-col min-h-screen">
        {isLoading ? (
          <SplashScreen finishLoading={handleFinishLoading} />
        ) : (
          <>
            <Header navigateWithParams={navigateWithParams} />
            <main className="flex-grow">{children}</main>
            <BackToTopButton />
            <BottomNavBar navigateWithParams={navigateWithParams} />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
