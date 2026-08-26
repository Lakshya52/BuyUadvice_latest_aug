import React from 'react'
import PageHeader from '../components/PageHeader' 
import Faq from '../components/Faq'
import Cta from '../components/Cta'

const About = () => {
  return (
    <>
      <PageHeader heading="About Us" paragraph="Proactive financial oversight and strategic risk management. Safeguarding your assets and ensure total compliance, rock-solid stability to your business needs to grow with confidence." />


      <div className="flex items-center justify-center h-dvh p-25 ">
        <div className="max-w-360 gap-11.25 flex items-center justify-between h-full w-full">
          <div className="w-1/2 h-full" >
            <img src="" alt="" className="h-full w-full border" />
          </div>
          <div className="flex items-center justify-start flex-col w-1/2" >
            <h1 className="heading mb-4" >From Vision to Professional Excellence</h1>
            <p className="para" >At BuyUadvice, we believe that every business deserves access to reliable financial expertise without the complexity. Whether you're an entrepreneur, startup, MSME, or an established organization, our goal is to connect you with experienced finance professionals who can help you make informed decisions and stay compliant.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-25  bg-(--color-accent-light)">
        <div className="flex flex-col max-w-360 gap-11.25" >
          <p className="para">
            From accounting and taxation to GST, audits, business registrations, and financial advisory, we bring together trusted professionals who understand the challenges businesses face. Our platform is designed to simplify the process of finding the right expertise while ensuring quality, transparency, and professionalism at every step.
          </p>
          <p className="para">
            We are committed to building long-term relationships based on trust, accuracy, and timely service. By combining technology with professional expertise, we make financial services more accessible, efficient, and hassle-free.</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center p-25 pb-0 h-dvh">
        <h1 className="heading mb-4"> The Pillars of Our Success</h1>
        <p className="para max-w-4xl"> From company registration to GST filing, income tax returns to trademark protection — we handle all your compliance needs in one place.</p>
        <div className="flex w-full gap-6 mt-10 max-w-360">
          <div className="bg-(--color-accent-light) hover:bg-(--color-accent) w-1/4 h-70 rounded-xl "></div>
          <div className="bg-(--color-accent-light) hover:bg-(--color-accent) w-1/4 h-70 rounded-xl "></div>
          <div className="bg-(--color-accent-light) hover:bg-(--color-accent) w-1/4 h-70 rounded-xl "></div>
          <div className="bg-(--color-accent-light) hover:bg-(--color-accent) w-1/4 h-70 rounded-xl "></div>
        </div>
      </div>


      <Faq />

      <Cta />
    </>
  )
}

export default About