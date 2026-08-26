import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqsData = [
  {
    question: "How can BuyUadvice help my business with GST registration and compliance?",
    answer: "BuyUadvice provides end-to-end support for GST registration, filing, and compliance management, ensuring your business stays up-to-date with the latest regulations through expert oversight and automated tracking."
  },
  {
    question: "What is AI-powered automation, and how can it benefit my business operations?",
    answer: "AI-powered automation streamlines repetitive tasks, reduces human error, and increases operational efficiency. It can handle everything from data entry to complex compliance checks, freeing up your team to focus on strategic growth."
  },
  {
    question: "How do I automate my business compliance processes with BuyUadvice?",
    answer: "You can easily automate your compliance by integrating our platform with your existing systems. Our dashboard provides a centralized view of all your compliance requirements, deadlines, and filing statuses."
  },
  {
    question: "How does BuyUadvice support compliance, registration and taxation for companies?",
    answer: "We offer comprehensive services that cover every stage of your company's lifecycle. From initial registration and structuring to ongoing tax filing and regulatory compliance, our experts provide personalized guidance and automated solutions."
  },
  {
    question: "What documents are required for company registration in India?",
    answer: "You'll typically need PAN cards of directors, address proof, identity proof, a registered office address, Digital Signature Certificates (DSC), and Director Identification Numbers (DIN). Our team guides you through the entire documentation process so nothing is missed."
  },
  {
    question: "How long does it take to register a Private Limited Company?",
    answer: "With BuyUadvice, a Private Limited Company can typically be registered within 7-10 business days, subject to MCA approvals and name availability. We expedite the process by handling all filings and follow-ups on your behalf."
  },
  {
    question: "Can BuyUadvice handle trademark registration and protection?",
    answer: "Yes. We conduct a thorough trademark search, file your application with the Indian Patent Office, and provide ongoing watch services to protect your brand from infringement. Our experts manage the entire process from filing to registration."
  },
  {
    question: "What are the penalties for non-compliance with GST filings?",
    answer: "Late filing of GST returns attracts a late fee of ₹50 per day (₹25 for nil returns) per return, along with interest at 18% per annum on outstanding tax. BuyUadvice's automated reminders and expert oversight help you avoid these penalties entirely."
  },
  {
    question: "How does the income tax filing process work on BuyUadvice?",
    answer: "Simply upload your Form 16, investment proofs, and other relevant documents. Our experts review your data, optimize your tax liability, and file your ITR accurately. You can track the entire process in real-time through your dashboard."
  },
  {
    question: "Is my business data safe and secure on BuyUadvice?",
    answer: "Absolutely. We use bank-grade encryption, secure cloud infrastructure, and strict access controls to protect your data. Your information is never shared with third parties without your explicit consent, and we comply with all applicable data protection regulations."
  }
];

const Faq = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <div className='flex w-full items-center justify-center px-25'>
        <div className="w-full flex flex-col items-center h-fit py-24 overflow-hidden max-w-360 mx-auto">
          <h2 className="heading text-center mb-6">Frequently Asked Questions</h2>
          
          <div className="w-full flex flex-col gap-4">
            {faqsData.map((faq, index) => {
              const isOpen = openFaq === index;
              return (  
                <div 
                  key={index} 
                  className={`rounded-2xl border transition-all duration-300 ${isOpen ? 'border-(--color-accent) shadow-[0_4px_24px_rgba(47,164,169,0.12)]' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className={`group w-full outline-none flex items-center justify-between p-6 md:p-8 text-left bg-white rounded-2xl transition-colors duration-300 ${isOpen ? '' : 'hover:bg-(--color-accent-light) cursor-pointer'}`}
                  >
                    <span className={`text-[18px] font-semibold pr-8 transition-colors duration-300 ${isOpen ? 'text-(--color-accent)' : 'text-[#1a1a1a] group-hover:text-(--color-primary)'}`}>
                      {faq.question}
                    </span>
                    <span className={`shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 text-(--color-accent)' : 'text-gray-400 group-hover:text-(--color-primary)'}`}>
                      <ChevronDown size={22} strokeWidth={2.5} />
                    </span>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-125' : 'max-h-0'}`}
                  >
                    <div className="px-8 pb-8 pt-0 text-[#475569] text-[16px] leading-[1.7]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  )
}

export default Faq
