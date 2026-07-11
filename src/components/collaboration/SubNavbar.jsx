import React, { useState } from 'react'
import { Menu, X,ArrowRight } from "lucide-react";
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { cn } from "../../util/lib/utils";

function SubNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const goToSection = (route, id) => {
        setIsOpen(false);
        if (location.pathname === route) {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate(route, { state: { scrollTo: id } });
        }
    };

    const navItems = [
        { label: "Networks", route: "/Networks", id: "network" },
        { label: "About", route: "/about", id: "intro" },
        { label: "Mission", route: "/about", id: "mission" },
        { label: "Customers", route: "/about", id: "customers" },
        { label: "Team", route: "/about", id: "team" },
    ];

    const renderNavItem = (item) => (
        <button
            key={item.label}
            onClick={() => goToSection(item.route, item.id)}
            className="hover:bg-muted text-sm rounded-xl px-2 py-2 cursor-pointer text-muted-foreground hover:text-foreground transition-all ease-in-out text-left"
        >
            {item.label}
        </button>
    );

    return (
        <header className="z-50 font-display fixed left-1/2 top-5 w-[min(1200px,calc(100%-2rem))] -translate-x-1/2">
            <nav className={cn(
                "nav-pill flex items-center justify-between px-6 py-3 pl-5 transition-[border-radius] duration-300",
                isOpen ? "rounded-3xl" : "rounded-full",
            )}>
                <RouterLink to="/">
                    <h3 className="flex text-xl gap-2 text-foreground font-bold">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                            <i className="fa-solid fa-bolt text-xl text-primary-foreground"></i>
                        </span>
                        <p><span className="text-2xl text-primary font-heading">Volt</span>Spot</p>
                    </h3>
                </RouterLink>

                <div className="hidden md:flex items-center space-x-6 text-md">
                    {navItems.map(renderNavItem)}
                    <button onClick={() => navigate("/logPatners")} className="w-full flex items-center bg-primary text-primary-foreground py-2 px-4 cursor-pointer gap-1 rounded-xl hover:opacity-90 transition group">
                        Talk to sales <ArrowRight width={20} height={20} className="h-5 w-5 transform transition-all duration-300 group-hover:translate-x-1" /> 
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
                        {navItems.map(renderNavItem)}
                        <button onClick={() => { setIsOpen(false); navigate("/logPatners"); }} className="w-full bg-primary text-primary-foreground py-2 cursor-pointer d rounded-2xl hover:opacity-90 transition">
                            Talk to sales
                        </button>
                    </ul>
                </div>
            )}
        </header>
    )
}

export default SubNavbar