import { useState } from "react";
import { Menu, X, User, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-scroll";
import { cn } from "../../util/lib/utils";
import ThemeToggle from "../../ui/ThemeToggle";

const Header = ({ isloging }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const isToken = sessionStorage.getItem("token");

  return (
    <header className="z-50 font-display fixed left-1/2 top-5 w-[min(1200px,calc(100%-2rem))] -translate-x-1/2">
      <nav className={cn(
        "nav-pill flex items-center justify-between px-6 py-3 pl-5 transition-[border-radius] duration-300",
        isOpen ? "rounded-3xl" : "rounded-full",
      )}>
        {/* Logo */}
        <Link to="/">
          <h3 className="flex text-xl gap-2 text-foreground font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <i className="fa-solid fa-bolt text-xl text-primary-foreground"></i>
            </span>
            <p><span className="text-2xl text-primary font-heading">Volt</span>Spot</p>
          </h3>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-md">
          {!isloging ? (
            <>
              <Link to="home" smooth={true} duration={500} className="text-sm text-muted-foreground cursor-pointer hover:text-primary">Home</Link>
              <Link to="about" smooth={true} duration={500} className="text-sm text-muted-foreground cursor-pointer hover:text-primary">About</Link>
              <button onClick={() => navigate("/homecolab")} className="text-sm cursor-pointer text-muted-foreground hover:text-primary">Patners</button>
              <Link to="features" smooth={true} duration={500} className="text-sm text-muted-foreground cursor-pointer hover:text-primary">features</Link>
              <Link to="support" smooth={true} duration={500} className="text-sm text-muted-foreground cursor-pointer hover:text-primary">support</Link>
              {!isToken && (
                <>
                  <ThemeToggle />
                  <button onClick={() => navigate("/login")} className="flex justify-center items-center gap-1 bg-primary cursor-pointer text-primary-foreground h-10 min-w-30 px-4 py-1 rounded-3xl font-semibold hover:opacity-90 transition-all duration-300 group">
                    Sign Up <ArrowRight size={16}
                    strokeWidth={1.75}
                    className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="relative flex items-center gap-3">
              <ThemeToggle />
              <button onClick={() => navigate("/profile")} className="w-full flex rounded-full bg-primary/20 items-center gap-1 px-3 py-2 hover:bg-primary/30 transition-colors cursor-pointer text-foreground">
                <User className="w-5 h-5" /> <span className="text-md font-normal">Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </nav>
      {/* Mobile Menu */}
      {isOpen && (
        <div className={cn(
          "nav-pill mt-2 overflow-hidden rounded-3xl transition-all duration-300 md:hidden",
          isOpen ? "max-h-[28rem] opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0 shadow-none",
        )}>
          <ul className="flex flex-col gap-1 p-3">
            {!isloging ? (
              <>
                <Link to="home" smooth={true} duration={500} className="hover:bg-muted text-sm rounded-xl px-2 py-2 cursor-pointer text-muted-foreground hover:text-foreground transition-all ease-in-out">Home</Link>
                <Link to="about" smooth={true} duration={500} className="hover:bg-muted text-sm rounded-xl px-2 py-2 cursor-pointer text-muted-foreground hover:text-foreground transition-all ease-in-out">About</Link>
                <button onClick={() => navigate("/homecolab")} className="hover:bg-muted justify-center cursor-pointer text-sm rounded-xl px-2 py-2 text-muted-foreground hover:text-foreground transition-all ease-in-out text-left">Patners</button>
                <Link to="features" smooth={true} duration={500} className="hover:bg-muted cursor-pointer text-sm rounded-xl px-2 py-2 text-muted-foreground hover:text-foreground transition-all ease-in-out">features</Link>
                <Link to="support" smooth={true} duration={500} className="hover:bg-muted cursor-pointer text-sm rounded-xl px-2 py-2 text-muted-foreground hover:text-foreground transition-all ease-in-out">support</Link>
                 {!isToken && (
                <>
                  <div className="flex justify-center py-2"><ThemeToggle /></div>
                  <button onClick={() => navigate("/login")} className="flex justify-center items-center gap-1 bg-primary cursor-pointer text-primary-foreground h-10 min-w-30 px-4 py-1 rounded-2xl font-semibold hover:opacity-90 transition-all duration-300 group">
                    Sign Up <ArrowRight width={20} height={20} className="h-5 w-5 transform transition-all duration-300 group-hover:translate-x-1" />
                  </button>
                </>
              )}
              </>
            ) : (
              <>
                <div className="flex justify-center py-2"><ThemeToggle /></div>
                <button onClick={() => navigate("/profile")} className="block py-2 px-4 hover:bg-muted rounded-xl text-foreground">Profile</button>
                <button onClick={handleLogout} className="block w-full py-2 px-4 hover:bg-muted rounded-xl text-foreground">Logout</button>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;