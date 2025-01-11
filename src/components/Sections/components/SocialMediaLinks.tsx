import Link from 'next/link';
import { FaFacebook, FaInstagram, FaExternalLinkAlt } from 'react-icons/fa';

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
          size={20}
          className="text-white hover:text-blue-300 transition-colors"
        />
      </Link>
      <Link
        href="https://www.instagram.com/escm34"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4"
      >
        <FaInstagram
          size={20}
          className="text-white hover:text-pink-400 transition-colors"
        />
      </Link>
      <Link
        href="https://www.escm34.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4"
      >
        <FaExternalLinkAlt
          size={22}
          className="text-white hover:text-gray-400 transition-colors"
        />
      </Link>
    </>
  );
};

export default SocialMediaLinks;
