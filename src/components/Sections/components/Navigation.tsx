"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaList,
  FaTrophy,
} from "react-icons/fa";
import SocialMediaLinks from "./SocialMediaLinks";

interface Props {
  navigateWithParams: (path: string) => void;
}

const Navigation = ({ navigateWithParams }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.id === "popup") {
      setIsOpen(false);
    }
  };

  const handleLinkClick = (path: string) => {
    navigateWithParams(path);
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
            <div
              className="flex items-center py-2 text-xl text-white hover:text-blue-300 uppercase cursor-pointer"
              onClick={() => handleLinkClick('/classement')}
            >
              <FaTrophy className="mr-2 text-white" /> Classement
            </div>
            <div
              className="flex items-center py-2 text-xl text-white hover:text-blue-300 uppercase cursor-pointer"
              onClick={() => handleLinkClick('/matchs')}
            >
              <FaCalendarAlt className="mr-2 text-white" /> Nos Matchs
            </div>
            <div
              className="flex items-center py-2 text-xl text-white hover:text-blue-300 uppercase cursor-pointer"
              onClick={() => handleLinkClick('/tous-les-matchs')}
            >
              <FaList className="mr-2 text-white" /> Tous les Matchs
            </div>
            <div
              className="flex items-center py-2 text-xl text-white hover:text-blue-300 uppercase cursor-pointer"
              onClick={() => handleLinkClick('/stats')}
            >
              <FaList className="mr-2 text-white" /> Stats
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
