import { useState, useEffect } from "react";
import { Menu, X, ChevronDown ,LogOut,User,ArrowRight} from "lucide-react";
import {  useNavigate } from 'react-router-dom';
import { Button, Link } from "react-scroll";
import { cn } from "../../util/lib/utils";

const Header = ({isloging}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate =useNavigate()

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/")
  };

  const isToken = sessionStorage.getItem("token")

  return (
    <header className=" z-50 font-[DM_Sans] fixed left-1/2 top-5 w-[min(1200px,calc(100%-2rem))] -translate-x-1/2 ">
      <nav className={cn(
          "nav-pill flex items-center justify-between px-6 py-3 pl-5 transition-[border-radius] duration-300",
          open ? "rounded-3xl" : "rounded-full",
        )}>
        
        {/* Logo */}
        <Link to="/">
          <h3 className=" flex text-xl gap-2 text-green-100 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 "> <i class="fa-solid fa-bolt text-xl" style={{color: "#f0efef"}}></i> </span>
           <p> <span className="text-2xl  text-green-600 font-michroma">Volt</span>Spot</p>
          </h3>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-md ">
          {!isloging ? (
            <>
                <Link to="home" smooth={true} duration={500} className= "text-sm text-gray-400 cursor-pointer hover:text-green-400">Home</Link>
                <Link to="about" smooth={true} duration={500} className= "text-sm text-gray-400 cursor-pointer hover:text-green-300">About</Link>
                <button  onClick={()=>{navigate("/homecolab")}} smooth={true} duration={500} className="text-sm cursor-pointer text-gray-400 hover:text-green-300">Patners</button>
                <Link to="features" smooth={true} duration={500} className="text-sm text-gray-400 cursor-pointer hover:text-green-300">features</Link>
                <Link to="support" smooth={true} duration={500} className=" text-sm text-gray-400 cursor-pointer hover:text-green-300">support</Link>   
                { !isToken&&(<button onClick={()=>{navigate("/login")}} className=" flex justify-center items-center gap-1 bg-green-500 cursor-pointer  text-gray-900 h-10 min-w-30 px-4 py-1 rounded-2xl font-semibold hover:bg-green-600  transition-all duration-300 
               group ">
                    Sign Up <ArrowRight width={20} height={20} className="h-5 w-5 transform transition-all duration-300 group-hover:translate-x-1"/>
                  </button>
                )}
            </>
            
          ) : (
            <div className="relative">
               <button onClick={()=>{navigate("/profile")}} className=" w-full flex rounded-full bg-[hsl(143,71%,28%)] items-center gap-1 px-3 py-2  hover:bg-green-700/50 transition-colors cursor-pointer text-gray-300 "><User className="w-5 h-5"/> <span   className="text-md font-normal">  Profile</span></button>
              
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div  className={cn(
          "nav-pill mt-2 overflow-hidden rounded-3xl transition-all duration-300 md:hidden",
          open ? "max-h-[28rem] opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0 shadow-none",
        )}>
          <ul className="flex flex-col gap-1 p-3">
            {!isloging ? (
              <>
              <Link to="home" smooth={true} duration={500} className=" hover:bg-neutral-800 text-sm rounded-xl px-2 py-2 cursor-pointer text-gray-400 hover:text-gray-200 transition-all ease-in-out">Home</Link>
              <Link to="about" smooth={true} duration={500} className=" hover:bg-neutral-800 text-sm rounded-xl px-2 py-2 cursor-pointer text-gray-400 hover:text-gray-200 transition-all ease-in-out">About</Link>
              <button onClick={()=>{navigate("/homecolab")}}smooth={true} duration={500} className="hover:bg-neutral-800 cursor-pointer text-sm rounded-xl px-2 py-2 text-gray-400 hover:text-gray-200 transition-all ease-in-out">Patners</button>
              <Link to="features" smooth={true} duration={500} className="hover:bg-neutral-800  cursor-pointer text-sm rounded-xl px-2 py-2 text-gray-400 hover:text-gray-200 transition-all ease-in-out ">features</Link>
              <Link to="support" smooth={true} duration={500} className=" hover:bg-neutral-800 cursor-pointer text-sm rounded-xl px-2 py-2 text-gray-400 hover:text-gray-200 transition-all ease-in-out">support</Link>
                  <button onClick={()=>{navigate("/login")}} className="w-full bg-green-600 text-gray-900 py-2 cursor-pointer font-semibold rounded-2xl hover:bg-green-500 transition">
                    Sign Up
                  </button>
              </>
            ) : (
              <>
                <button onClick={()=>{navigate("/profile")}} className="block py-2 px-4 hover:bg-gray-700">Profile</button>
                <button onClick={handleLogout} className="block w-full  py-2 px-4 hover:bg-gray-700">Logout</button>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
