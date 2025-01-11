"use client";

import "./globals.css";
import { Header } from "~/src/components/Header/Header";
import Footer from "~/src/components/Footer/footer";
import BackToTopButton from '../src/components/Sections/components/BackToTopButton';
import BottomNavBar from "~/src/components/Sections/components/BottomNavBar";
import SplashScreen from "~/src/components/Sections/components/SplashScreen";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChickenSoccerStory from "~/src/components/Sections/components/ChickenSoccerStory";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isHome = pathName === "/";
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifie si le splash screen a déjà été affiché
    const hasShownSplash = localStorage.getItem("hasShownSplash");

    if (!hasShownSplash && isHome) {
      setIsLoading(true); // Affiche le splash screen si c'est la première visite
    } else {
      setIsLoading(false); // Sinon, ne pas afficher 
    }
  }, [isHome]);

  const handleFinishLoading = () => {
    setIsLoading(false);
    localStorage.setItem("hasShownSplash", "true");
  };

  return (
    <html lang="en">
      <head />
      <body className="flex flex-col min-h-screen">
        {isLoading ? (
          <SplashScreen finishLoading={handleFinishLoading} />
        ) : (
          <>
            <Header />
            <main className="flex-grow">{children}</main>
            <BackToTopButton />
            <BottomNavBar />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
