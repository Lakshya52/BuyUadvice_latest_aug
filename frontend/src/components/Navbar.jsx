import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react';

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/partner", label: "Partner" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const { openLogin, user, logout } = useAuth();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // if (pathname !== '/') {
    if (['/partner'].includes(pathname)) {
      setHidden(false);
      return;
    }

    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <div className={`sticky top-0 z-50 w-full flex items-center justify-center px-25 transition-transform duration-300 bg-white ${hidden ? '-translate-y-full' : 'translate-y-0'} `}>
          <div className={`w-full flex items-center justify-between h-25 max-w-360 mx-auto bg-white `} >
              <Link to="/" className='outline-none' >
                  <img src="/Logo.png" alt="BuyUadvice logo" />
              </Link>
              <div className='flex gap-6 items-center justify-center'>
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-(--color-accent) after:transition-all after:duration-300 hover:after:w-full ${pathname === link.to ? "after:w-full" : "after:w-0"}`}
                      >
                      {link.label}
                    </Link>
                  ))}
                  {user ? (
                    <div className='flex gap-4 items-center'>
                      {/* <Link to="/dashboard" className='btn-primary'>{user.name}</Link> */}
                      <Link to="/dashboard" className='btn-primary'>Dashboard</Link>
                      <button onClick={logout} className='text-[15px] text-gray-500 hover:text-gray-800 cursor-pointer transition-colors'>
                        <LogOut />
                      </button>
                    </div>
                  ) : (
                    <button onClick={openLogin} className='btn-primary'>Login</button>
                  )}
              </div>
          </div>
      </div>
    </>
  )
}

export default Navbar