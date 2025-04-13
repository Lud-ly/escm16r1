"use client";

import { usePathname } from 'next/navigation';
import { FaChartLine, FaCalendarAlt, FaList, FaTrophy } from 'react-icons/fa';

interface Props {
  withParams: (path: string) => void;
}

const BottomNavBar: React.FC<Props> = ({ withParams }) => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-col items-center relative ${isActive ? 'text-yellow-500 scale-110' : 'text-white'} cursor-pointer`;
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
        <div 
          onClick={() => withParams('/')} 
          className={getLinkStyle('/')}
        >
          <FaTrophy className="text-[30px] sm:text-[34px] mb-3" />
          <span className="text-[8px] sm:text-xs">Classement</span>
        </div>

        {/* Bouton Matchs */}
        <div 
          onClick={() => withParams('/matchs')} 
          className={getLinkStyle('/matchs')}
        >
          <FaCalendarAlt className="text-[30px] sm:text-[34px] mb-3" />
          <span className="text-[8px] sm:text-xs">Matchs</span>
        </div>

        {/* Bouton Tous les Matchs */}
        <div 
          onClick={() => withParams('/tous-les-matchs')} 
          className={getLinkStyle('/tous-les-matchs')}
        >
          <FaList className="text-[30px] sm:text-[34px] mb-3" />
          <span className="text-[8px] sm:text-xs">Journées</span>
        </div>

        {/* Bouton Stats */}
        <div 
          onClick={() => withParams('/stats')} 
          className={getLinkStyle('/stats')}
        >
          <FaChartLine className="text-[30px] sm:text-[34px] mb-3" />
          <span className="text-[8px] sm:text-xs">Stats</span>
        </div>

      </div>
    </nav>
  );
};

export default BottomNavBar;
