import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaChartLine,
  FaCalendarAlt,
  FaList,
  FaFutbol,
  FaTrophy,
} from "react-icons/fa";
import SocialMediaLinks from "./SocialMediaLinks";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.id === "popup") {
      setIsOpen(false);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="shadow-md">
      <div className="flex justify-between items-center p-4">
        <button
          className="text-red focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "🐔" : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu déroulant */}
      {isOpen && (
        <div
          id="popup"
          className="fixed inset-0 bg-black bg-opacity-70 z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-[rgb(110, 11, 20)] bg-opacity-50 w-3/4 sm:w-1/3 h-full flex flex-col p-4">
            <div className="flex justify-between items-center mb-10">
              <div className="home flex flex-row items-center">
                <Image
                  src="/images/logo.jpg"
                  alt="logo escm"
                  width={70}
                  height={70}
                  priority
                />
                <h1 className="ml-2 text-xl font-bold text-white">U16 R1</h1>
              </div>
              <button
                className="text-white focus:outline-none"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="flex justify-end items-center mb-10">
              <SocialMediaLinks />
            </div>
            <Link
              href="/classement"
              className="flex items-center py-2 text-xl text-white hover:text-blue-300 uppercase"
              onClick={handleLinkClick}
            >
              <FaTrophy className="mr-2 text-white" /> Classement
            </Link>
            <Link
              href="/matchs"
              className="flex items-center py-2 text-xl text-white hover:text-blue-300 uppercase"
              onClick={handleLinkClick}
            >
              <FaCalendarAlt className="mr-2 text-white" /> Nos Matchs
            </Link>
            <Link
              href="/tous-les-matchs"
              className="flex items-center py-2 text-xl text-white hover:text-blue-300 uppercase"
              onClick={handleLinkClick}
            >
              <FaList className="mr-2 text-white" /> Tous les Matchs
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
