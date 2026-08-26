import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { Link } from "react-router-dom"
import { Building2, Receipt, Landmark, Banknote, BadgeCheck, ArrowRight, FileText, Utensils, Rocket, Globe, Ship, FileCheck, ArrowUpRight, Bold, Plus, Minus } from 'lucide-react'
import Faq from '../components/Faq'
import Partner from '../pages/Partner'
import Cta from '../components/Cta'
import { useAuth } from '../context/AuthContext'

const servicesData = [
  {
    icon: Building2,
    iconColor: "text-blue-500",
    title: "Company Registration",
    desc: "Private Limited, LLP, OPC, and other business registrations with complete incorporation support.",
    arrowColor: "text-blue-500",
  },
  {
    icon: Receipt,
    iconColor: "text-green-500",
    title: "GST Registration",
    desc: "Complete GST registration support with documentation, application filing, and compliance guidance.",
    arrowColor: "text-green-500",
  },
  {
    icon: FileText,
    iconColor: "text-purple-500",
    title: "GST Return Filing",
    desc: "Accurate GSTR-1, GSTR-3B, reconciliation, and regular GST return filing support.",
    arrowColor: "text-purple-500",
  },
  {
    icon: Landmark,
    iconColor: "text-orange-500",
    title: "MCA Compliance",
    desc: "ROC annual filings, director KYC, company changes, and ongoing MCA compliance management.",
    arrowColor: "text-orange-500",
  },
  {
    icon: BadgeCheck,
    iconColor: "text-red-500",
    title: "Trademark Registration",
    desc: "Search, file, and protect your brand with end-to-end trademark registration support.",
    arrowColor: "text-red-500",
  },
  {
    icon: Utensils,
    iconColor: "text-teal-500",
    title: "FSSAI Registration",
    desc: "FSSAI registration and licensing support for food businesses with complete documentation assistance.",
    arrowColor: "text-teal-500",
  },
  {
    icon: Rocket,
    iconColor: "text-indigo-500",
    title: "Startup India",
    desc: "Startup India registration and recognition support to help your business access government benefits.",
    arrowColor: "text-indigo-500",
  },
  {
    icon: Globe,
    iconColor: "text-cyan-500",
    title: "Foreign Accounting",
    desc: "Accounting and bookkeeping support for businesses dealing with international operations and transactions.",
    arrowColor: "text-cyan-500",
  },
  {
    icon: Banknote,
    iconColor: "text-yellow-500",
    title: "Income Tax Filing",
    desc: "Individual and business ITR filing, tax compliance, and expert assistance for accurate returns.",
    arrowColor: "text-yellow-500",
  },
  {
    icon: Building2,
    iconColor: "text-emerald-500",
    title: "Udyam Registration",
    desc: "Quick Udyam MSME registration to establish your business and access eligible government benefits.",
    arrowColor: "text-emerald-500",
  },
  {
    icon: Ship,
    iconColor: "text-sky-500",
    title: "Import / Export Code",
    desc: "IEC registration support for businesses looking to start or expand international trade operations.",
    arrowColor: "text-sky-500",
  },
  {
    icon: FileCheck,
    iconColor: "text-pink-500",
    title: "RCMC Registration",
    desc: "RCMC registration assistance to help exporters access trade benefits and industry-specific support.",
    arrowColor: "text-pink-500",
  },
];

const stepsData = [
  {
    num: "01",
    title: "Choose the Right Business Structure",
    desc: "Select the ideal business entity based on your goals, industry, and future growth plans. Our experts help you make the right choice from day one.",
    img: "/servicesimages/step1.jpg"
  },
  {
    num: "02",
    title: "Register Your Business",
    desc: "Complete your business registration quickly and hassle-free. We handle the documentation and legal formalities so you can focus on building your business.",
    img: "servicesimages/step2.jpg"
  },
  {
    num: "03",
    title: "Set Up Tax & Compliance",
    desc: "Get your GST registration, PAN, TAN, and other essential tax compliances completed with expert assistance, ensuring your business is ready to operate.",
    // img: "https://images.unsplash.com/photo-1741090255478-f7c31638b8a6?w=800&h=600&fit=crop&q=80"
    img: "heroimages/Hero4.jpg"
  },
  {
    num: "04",
    title: "Stay Compliant & Grow",
    desc: "From GST returns and ROC filings to accounting and annual compliance, we help your business stay compliant while you focus on growth.",
    img: "heroimages/Hero3.jpg"
  }
];


const heroImages = [
  '/heroimages/Hero2.jpg',
  '/heroimages/Hero1.jpg',
  '/heroimages/Hero4.jpg',
  '/heroimages/Hero3.jpg',
]

const Landing = () => {
  const { openLogin } = useAuth();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <>
      {/* hero */}
      <div className="relative h-[calc(100dvh-100px)] bg-[url('/BgEffects.svg')] bg-cover bg-no-repeat bg-center flex items-center justify-center w-full overflow-hidden">
        <div className='flex items-center justify-between w-full mx-25 gap-[50px] pb-10 max-w-360 h-full' >
          
          {/* hero left */}
          <div className='flex items-start flex-col gap-[17px] w-1/2'>
            <h1 className='heading' >Tax and Compliance Services, Made Simple</h1>
            <p className='para' >The only platform which will help you to find and connect with experts, to provide you right advice and get your work done.</p>
            <div className="flex gap-3">
              <button onClick={openLogin} className='btn-primary'>Get Started</button>
              <Link to="/about">
                <button className='btn-border'>About Us</button>
              </Link>
            </div>
          </div>
          
          {/* hero right */}
          <div className='relative flex ml-auto items-end justify-center flex-col gap-[17px] w-1/2 h-full'>
            <div className='relative z-20 h-100 min-w-[500px] mr-[34px] rounded-[15px] overflow-hidden flex items-center justify-end'>
              {heroImages.map((img, i) => (
                <img
                  key={img}
                  src={img}
                  alt=""
                  className={`absolute inset-0 h-full  object-cover rounded-[15px] transition-opacity duration-700 ease-in-out ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
            </div>
            
            <div className="flex absolute h-full w-full items-center">
              <div className="h-[50%] flex-1"></div>
              <div className="h-[470px] bg-(--color-primary) w-[60%] rounded-[50px] "></div>
            </div>

          </div>
        </div>
      </div>

      {/* services */}
      <div className="px-25 flex items-center justify-center w-full">

        <div className='min-h-dvh py-50 flex flex-col items-center justify-center mx-25 max-w-360 mx-auto'>
          <h1 className='heading mb-[13px] text-center'>Complete Compliance Solution</h1>
          <p className='para text-center mb-[45px] max-w-4xl' style={{fontSize: "19px"}}>From company registration to GST filing, income tax returns to trademark protection — we handle all your compliance needs in one place.</p>
          {/* services cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full ">
            {servicesData.map((service, index) => (
              <div key={index} className="flex flex-col p-8 bg-white rounded-[24px] border border-gray-200 hover:-translate-y-2 hover:shadow-[0_8px_64px_rgba(47,164,169,0.25)] transition-all duration-300 cursor-pointer">
                <div className={`mb-5 ${service.iconColor}`}>
                  <service.icon size={26} strokeWidth={1.75} />
                </div>
                <h3 className="text-[19px] font-semibold text-[#1a1a1a] mb-3">{service.title}</h3>
                <p className="text-[#666666] text-[15px] leading-relaxed mb-8 grow">{service.desc}</p>
                <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold text-[#1a1a1a] hover:opacity-75 transition-opacity mt-auto">
                  Learn more <ArrowRight size={18} strokeWidth={2.5} className={service.arrowColor} />
                </Link>
              </div>
            ))}
          </div>
          <Link to="/services" className='group flex items-center gap-0 justify-center mt-10 '>View All Services <span className="inline-block w-0 overflow-hidden opacity-0 group-hover:w-5 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300"><ArrowUpRight size={20} /></span></Link>

        </div>

      </div>

      {/* steps */}
      <div className="relative w-full bg-linear-to-br from-[#d4f0f0] via-[#e8f6f6] to-[#f8fcfc] py-24 mb-10 overflow-visible flex items-center justify-center ">
        <div className="flex flex-col md:flex-row gap-12 items-start relative mx-25 max-w-360">
          
          {/* Left Fixed Column */}
          <div className="w-full md:w-1/2 sticky top-32 flex flex-col items-start gap-6">
            <h2 className="heading ">
              Start your<br/>Business in India
            </h2>
            <p className="para" style={{fontSize: "19px"}}>
              Choose your business structure — Private Limited, LLP, or OPC. We guide you through company registration, GST registration, tax filing, and all compliance requirements.
            </p>
            <button onClick={openLogin} className="btn-primary">
              Get Started
            </button>
          </div>

          {/* Right Scrolling Column */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            {stepsData.map((step, index) => (
              <div key={index} className=" flex flex-col bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-200 rounded-3xl items-center gap-6">
                <img src={step.img} alt={step.title} className="w-full h-auto object-cover shrink-0 rounded-2xl" />
                <div className="flex-1">
                  <div className="heading" style={{color: "#cbd5e1"}}>{step.num}</div>
                  <h3 className="heading mb-3 " style={{color: "#2db3ab", fontSize: "40px" }}>{step.title}</h3>
                  <p className="text-[#475569] text-[19px] leading-[1.6]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* faq */}
      <Faq />

      {/* vendor registration */}
      <Partner />

      {/* cta */}
      <Cta />

    </>
  )
}

export default Landing