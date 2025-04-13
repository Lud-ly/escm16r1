import Link from 'next/link';
import { FaFacebook, FaInstagram, FaGlobe } from 'react-icons/fa';

const SocialMediaLinks: React.FC = () => {
  return (
    <>
      <Link
        href="https://www.facebook.com/escm34/?locale=fr_FR"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4"
      >
        <FaFacebook
          size={30}
          className="text-red-800 hover:text-blacktransition-colors"
        />
      </Link>
      <Link
        href="https://www.instagram.com/escm34"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4"
      >
        <FaInstagram
          size={30}
          className="text-red-800 hover:text-black transition-colors"
        />
      </Link>
      <Link
        href="https://www.escm34.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4"
      >
         <FaGlobe
            size={25}
            className="text-red-800 hover:text-black transition-colors"
          />
      </Link>
    </>
  );
};

export default SocialMediaLinks;
