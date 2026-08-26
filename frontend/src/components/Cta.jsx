import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Cta = () => {
  const { openLogin } = useAuth();

  return (
    <div className=" w-full  flex justify-center items-center px-25 my-24">
      <div 
        className="w-full max-w-360 rounded-xl py-16 px-8 flex flex-col items-center text-center relative overflow-hidden bg-(--color-primary)"
      >
        {/* Subtle dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{ 
            backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', 
            backgroundSize: '24px 24px' 
          }}
        ></div>
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h2 className="heading" style={{color: 'white'}}>
            Ready to get started?
          </h2>
          <p className="para leading-[1.6] max-w-3xl " style={{color: 'white', fontSize: '19px'}}>
            Create an account to start your company registration or migrate your existing business. No credit card required to explore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto">
            <Link to="/contact">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-md border border-[#cbd5e1] text-white font-medium hover:bg-white/10 transition-colors text-[16px]">
                Contact Us
              </button>
            </Link>
            <button onClick={openLogin} className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-(--color-accent-light) hover:bg-(--color-accent) text-white font-medium transition-colors text-[16px]">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cta;
