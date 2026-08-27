import React from 'react'
import PageHeader from '../components/PageHeader' 
import Faq from '../components/Faq'
import Cta from '../components/Cta'
import { Eye, Users, Monitor, HeartHandshake } from 'lucide-react'

const pillarsData = [
  {
    icon: Eye,
    title: "Transparency",
    desc: "Clear pricing, honest communication, and no hidden fees. We believe in complete openness in every interaction.",
  },
  {
    icon: Users,
    title: "Expertise",
    desc: "Access to experienced Chartered Accountants, Company Secretaries, and professionals who understand your business.",
  },
  {
    icon: Monitor,
    title: "Technology",
    desc: "A digital-first platform that simplifies compliance, tracks deadlines, and keeps your business running smoothly.",
  },
  {
    icon: HeartHandshake,
    title: "Trust",
    desc: "Long-term relationships built on accuracy, reliability, and timely service — your business deserves nothing less.",
  },
];

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
        <h1 className="heading mb-4">The Pillars of Our Success</h1>
        <p className="para max-w-4xl">The values that drive everything we do — from how we build our platform to how we serve every client.</p>
        <div className="flex w-full gap-6 mt-10 max-w-360">
          {pillarsData.map((pillar, i) => (
            <div key={i} className="group bg-(--color-accent-light) hover:bg-(--color-accent) w-1/4 h-90  rounded-xl p-8 flex flex-col items-center justify-start text-center transition-colors duration-300 cursor-default">
              <div className="w-14 h-14 rounded-full bg-(--color-accent) group-hover:bg-white flex items-center justify-center mb-5 transition-colors duration-300">
                <pillar.icon size={26} className="text-white group-hover:text-(--color-accent)" strokeWidth={1.75} />
              </div>
              <h3 className="text-[25px] font-bold text-(--color-primary) group-hover:text-white mb-3 transition-colors duration-300">{pillar.title}</h3>
              <p className="text-[18px] text-(--color-gray) group-hover:text-white/80 leading-relaxed transition-colors duration-300">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>


      <Faq />

      <Cta />
    </>
  )
}

export default About