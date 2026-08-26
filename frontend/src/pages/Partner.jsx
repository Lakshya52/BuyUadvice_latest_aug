import React from 'react'
import { Link } from 'react-router-dom'

const Partner = () => {
  return (
    <div className="relative h-[calc(100dvh-100px)] bg-[url('/BgEffects.svg')] bg-cover bg-no-repeat bg-center flex items-center justify-center w-full overflow-hidden">
        <div className='flex max-w-360 items-center justify-between w-full mx-25 gap-[50px] pb-10' >
          
          {/* partner left */}
          <div className='flex items-start flex-col gap-[17px] w-1/2'>
            <h1 className='heading' >Let's Grow Together</h1>
            <p className="para" style={{fontSize: "19px"}} >Whether you're a Chartered Accountant, Accountant, Tax Consultant, Financial Advisor, or an independent professional, join our partner network and grow by helping businesses with their financial needs.</p>
            <div className="flex gap-3 items-center">
              <Link to="/">
                <button className='btn-primary '>Vendor Registration</button>
              </Link>
              <span>~ coming soon</span>
            </div>
          </div>
          {/* partner right */}
          <div className='flex items-start flex-col gap-[17px] '>
            <img src="/PartnerImage.png" alt="" />
          </div>
        </div>
      </div>
  )
}

export default Partner