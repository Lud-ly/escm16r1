"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartLine, FaCalendarAlt, FaList, FaTrophy } from 'react-icons/fa';

const BottomNavBar: React.FC = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-col items-center relative ${isActive ? 'text-yellow-500 scale-110' : 'text-white'}`;
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 shadow-lg rounded-t-3xl"
      style={{
        backgroundColor: "rgb(110, 11, 20)",
        padding: "10px 0",
        zIndex: 1000,
      }}
    >
      <div className="flex justify-around items-center p-2">
        {/* Bouton Classement */}
        <Link href="/" className={getLinkStyle('/')}>
          <FaTrophy className="text-[30px] sm:text-[34px] mb-3" />
          {/* <span className="text-[8px] sm:text-xs">Classement</span> */}
        </Link>

        {/* Bouton Matchs */}
        <Link href="/matchs" className={getLinkStyle('/matchs')}>
          <FaCalendarAlt className="text-[30px] sm:text-[34px] mb-3" />
          {/* <span className="text-[8px] sm:text-xs">Nos matchs</span> */}
        </Link>

        {/* Bouton Tous les Matchs */}
        <Link href="/tous-les-matchs" className={getLinkStyle('/tous-les-matchs')}>
          <FaList className="text-[30px] sm:text-[34px] mb-3" />
          {/* <span className="text-[8px] sm:text-xs">Tous les Matchs</span> */}
        </Link>

      </div>
      <div className="flex justify-center items-center">
        <div className="text-right flex flex-row items-center mx-auto">
          <h6 className="text-[9px] text-white font-semibold tracking-wide mr-3">
            🐔 Les Rôtis du Foot &copy; {currentYear}
          </h6>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavBar;
