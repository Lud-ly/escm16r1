const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-4" style={{ backgroundColor: "#6e0b14" }}>
      <div className="flex justify-center items-center">
        <div className="text-right flex flex-row items-center mx-auto">
          <span className="text-[10px] text-white">Source:</span>
          <a
            href="https://occitanie.fff.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-white ml-1 underline hover:text-blue-500 transition-colors"
          >
            occitanie.fff.fr
          </a>
          <h6 className="text-[10px] text-white font-semibold tracking-wide ml-2">
            L.Mouly &copy; {currentYear}
          </h6>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
