import slcLogo from "../assets/slc-logo.png";
import saoLogo from "../assets/sao.png";

const Header = ({
  variant = "public",
  time,
  date,
  onOpenLogin,
  showLogin = false,
  rightContent,
}) => {
  return (
    <header className="w-full bg-[#005F86] border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

  <div className="flex items-center gap-3 sm:gap-5 min-w-0">

    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      <img
        src={slcLogo}
        alt="SLC Logo"
        className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
      />

      <img
        src={saoLogo}
        alt="SAO Logo"
        className="w-12 h-12 sm:w-14 sm:h-14 lg:w-18 lg:h-18 object-contain rounded-full"
      />
    </div>

    <div className="leading-tight min-w-0">
      <h1 className="text-white text-2xl sm:text-3xl lg:text-5xl font-normal font-old-english leading-none">
        Saint Louis College
      </h1>

      <p className="text-white italic text-xs sm:text-base lg:text-xl mt-1">
        Lingsat, City of San Fernando, La Union
      </p>

      <p className="text-white text-xs sm:text-base lg:text-xl">
        Seek & Balik: A Lost and Found Management System
      </p>
    </div>

  </div>

  {variant === "dashboard" ? (
    <div className="flex md:flex-col items-start md:items-end justify-between md:justify-center text-white md:mr-8 border-t border-white/15 md:border-t-0 pt-3 md:pt-0 w-full md:w-auto">
      <p className="text-lg sm:text-xl lg:text-2xl font-bold font-mono">
        {time}
      </p>

      <p className="text-xs uppercase opacity-70">
        {date}
      </p>
    </div>
  ) : (
    <div className="w-full md:w-auto flex justify-start md:justify-end border-t border-white/15 md:border-t-0 pt-3 md:pt-0">
      {rightContent}

      {!rightContent && showLogin && (
        <button
          onClick={onOpenLogin}
          className="w-full sm:w-auto px-6 py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/20 text-white transition"
        >
          Staff Login
        </button>
      )}
    </div>
  )}
</header>
  );
};

export default Header;