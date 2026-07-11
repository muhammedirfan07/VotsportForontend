import React, { useState } from 'react'
import { Menu, X, User, ArrowRight } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { cn } from "../../util/lib/utils";

function SubNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <header className="z-50 font-display fixed left-1/2 top-5 w-[min(1200px,calc(100%-2rem))] -translate-x-1/2">
            <nav className={cn(
                "nav-pill flex items-center justify-between px-6 py-3 pl-5 transition-[border-radius] duration-300",
                isOpen ? "rounded-3xl" : "rounded-full",
            )}>
                <Link to="/">
                    <h3 className="flex text-xl gap-2 text-foreground font-bold">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                            <i className="fa-solid fa-bolt text-xl text-primary-foreground"></i>
                        </span>
                        <p><span className="text-2xl text-primary font-heading">Volt</span>Spot</p>
                    </h3>
                </Link>

                <div className="hidden md:flex items-center space-x-6 text-md">
                    <Link to="network" smooth={true} duration={500} className="hover:bg-muted text-sm rounded-xl px-2 py-2 cursor-pointer text-muted-foreground hover:text-foreground transition-all ease-in-out">Home</Link>
                    <button onClick={() => navigate("/Networks")} className="hover:bg-muted cursor-pointer text-sm rounded-xl px-2 py-2 text-muted-foreground hover:text-foreground transition-all ease-in-out text-left">About</button>
                    <Link to="mission" hash="" smooth={true} duration={500} className="hover:bg-muted cursor-pointer text-sm rounded-xl px-2 py-2 text-muted-foreground hover:text-foreground transition-all ease-in-out">mission</Link>
                    <Link to="customers" smooth={true} duration={500} className="hover:bg-muted cursor-pointer text-sm rounded-xl px-2 py-2 text-muted-foreground hover:text-foreground transition-all ease-in-out">customers</Link>
                    <Link to="team" smooth={true} duration={500} className="hover:bg-muted cursor-pointer text-sm rounded-xl px-2 py-2 text-muted-foreground hover:text-foreground transition-all ease-in-out">team</Link>
                    <button onClick={() => navigate("/logPatners")} className="w-full bg-primary text-primary-foreground py-2 cursor-pointer font-semibold rounded-2xl hover:opacity-90 transition">
                        Talk to sales
                    </button>
                </div>
                <button className="md:hidden text-foreground focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={30} /> : <Menu size={30} />}
                </button>
            </nav>
            {isOpen && (
                <div className={cn(
                    "nav-pill mt-2 overflow-hidden rounded-3xl transition-all duration-300 md:hidden",
                    isOpen ? "max-h-[28rem] opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0 shadow-none",
                )}>
                    <ul className="flex flex-col gap-1 p-3">
                        <Link to="network" smooth={true} duration={500} className="hover:bg-muted text-sm rounded-xl px-2 py-2 cursor-pointer text-muted-foreground hover:text-foreground transition-all ease-in-out">Home</Link>
                        <button onClick={() => navigate("/Networks")} className="hover:bg-muted cursor-pointer text-sm rounded-xl px-2 py-2 text-muted-foreground hover:text-foreground transition-all ease-in-out text-left">About</button>
                        <Link to="mission" smooth={true} duration={500} className="hover:bg-muted cursor-pointer text-sm rounded-xl px-2 py-2 text-muted-foreground hover:text-foreground transition-all ease-in-out">mission</Link>
                        <Link to="customers" smooth={true} duration={500} className="hover:bg-muted cursor-pointer text-sm rounded-xl px-2 py-2 text-muted-foreground hover:text-foreground transition-all ease-in-out">customers</Link>
                        <Link to="team" smooth={true} duration={500} className="hover:bg-muted cursor-pointer text-sm rounded-xl px-2 py-2 text-muted-foreground hover:text-foreground transition-all ease-in-out">team</Link>
                        <button onClick={() => navigate("/logPatners")} className="w-full bg-primary text-primary-foreground py-2 cursor-pointer font-semibold rounded-2xl hover:opacity-90 transition">
                            Talk to sales
                        </button>
                    </ul>
                </div>
            )}

        </header>
    )
}

export default SubNavbar