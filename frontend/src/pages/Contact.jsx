import React, { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { MapPin, Phone, Mail, CheckCircle2, ArrowRight } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  })
  
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    // Simulating API submission
    setTimeout(() => {
      setStatus('success')
    }, 1500)
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      subject: '',
      message: ''
    })
    setStatus('idle')
  }

  return (
    <>
      <PageHeader 
        heading="Get In Touch" 
        paragraph="Have any questions about tax, compliance, or our services? Our team of experts is here to help you navigate your business journey with precision and care." 
      />

      {/* Main Contact Section */}
      <section className="w-full flex justify-center py-20 px-6 md:px-25 bg-[#fbfaf7]">
        <div className="max-w-360 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 w-full bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-xs">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center py-10 animate-fade-in">
                <div className="w-20 h-20 bg-(--color-accent-light) rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={42} className="text-(--color-accent)" />
                </div>
                <h3 className="text-2xl font-bold text-(--color-primary) mb-3">Message Sent Successfully!</h3>
                <p className="text-(--color-gray) text-base max-w-md mb-8">
                  Thank you for reaching out, <span className="font-semibold text-(--color-primary)">{formData.fullName}</span>. 
                  We've received your query regarding <span className="italic">"{formData.subject}"</span> and our expert consultants will get back to you shortly.
                </p>
                <button
                  onClick={resetForm}
                  className="btn-primary-accent flex items-center gap-2 font-bold px-8 py-3.5"
                >
                  Send Another Message <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="fullName" className="text-(--color-primary) text-[16px] font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#E5E7EB]/50 focus:bg-white px-5 py-4 rounded-xl outline-none border border-transparent focus:border-(--color-accent)/30 transition-all text-(--color-primary) font-semibold text-[15px]"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-(--color-primary) text-[16px] font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-[#E5E7EB]/50 focus:bg-white px-5 py-4 rounded-xl outline-none border border-transparent focus:border-(--color-accent)/30 transition-all text-(--color-primary) font-semibold text-[15px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phoneNumber" className="text-(--color-primary) text-[16px] font-semibold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#E5E7EB]/50 focus:bg-white px-5 py-4 rounded-xl outline-none border border-transparent focus:border-(--color-accent)/30 transition-all text-(--color-primary) font-semibold text-[15px]"
                    />
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-(--color-primary) text-[16px] font-semibold">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. GST Registration inquiry"
                      className="w-full bg-[#E5E7EB]/50 focus:bg-white px-5 py-4 rounded-xl outline-none border border-transparent focus:border-(--color-accent)/30 transition-all text-(--color-primary) font-semibold text-[15px]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-(--color-primary) text-[16px] font-semibold">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help your business..."
                    className="w-full bg-[#E5E7EB]/50 focus:bg-white px-5 py-4 rounded-xl outline-none border border-transparent focus:border-(--color-accent)/30 transition-all text-(--color-primary) font-semibold text-[15px] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-(--color-accent) hover:bg-(--color-accent-dark) text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow cursor-pointer text-center text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sending Message...' : 'Submit'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Channels Info */}
          <div className="lg:col-span-5 w-full flex flex-col gap-8">
            <div>
              <p className="text-(--color-primary) text-[18px] md:text-[20px] leading-[1.6] font-semibold">
                Reach out to us through any of these channels. Our specialized consultants are ready to assist with your specific business requirements.
              </p>
            </div>

            {/* Channels List */}
            <div className="flex flex-col gap-8 mt-4">
              
              {/* Channel 1: Address */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-[#E5E7EB]/60 rounded-xl flex items-center justify-center flex-shrink-0 text-(--color-primary)">
                  <MapPin size={24} className="stroke-[1.75]" />
                </div>
                <div className="flex flex-col pt-1">
                  <p className="text-(--color-primary) text-[16px] md:text-[17px] font-semibold leading-relaxed">
                    5th Floor, 508, Vishal Chambers,
                  </p>
                  <p className="text-(--color-primary) text-[16px] md:text-[17px] font-semibold leading-relaxed">
                    Noida Sector 18, Uttar Pradesh, 201301
                  </p>
                </div>
              </div>

              {/* Channel 2: Phone */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-[#E5E7EB]/60 rounded-xl flex items-center justify-center flex-shrink-0 text-(--color-primary)">
                  <Phone size={24} className="stroke-[1.75]" />
                </div>
                <div className="flex flex-col pt-1">
                  <a 
                    href="tel:+911234567895" 
                    className="text-(--color-primary) hover:text-(--color-accent) text-[16px] md:text-[17px] font-semibold leading-relaxed transition-colors"
                  >
                    +911234567895
                  </a>
                  <a 
                    href="tel:+911234567895" 
                    className="text-(--color-primary) hover:text-(--color-accent) text-[16px] md:text-[17px] font-semibold leading-relaxed transition-colors"
                  >
                    +911234567895
                  </a>
                </div>
              </div>

              {/* Channel 3: Email */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-[#E5E7EB]/60 rounded-xl flex items-center justify-center flex-shrink-0 text-(--color-primary)">
                  <Mail size={24} className="stroke-[1.75]" />
                </div>
                <div className="flex flex-col pt-1">
                  <a 
                    href="mailto:info@buyuadvice.com" 
                    className="text-(--color-primary) hover:text-(--color-accent) text-[16px] md:text-[17px] font-semibold leading-relaxed transition-colors"
                  >
                    info@buyuadvice.com
                  </a>
                  <a 
                    href="mailto:casurajkumar1985@gmail.com" 
                    className="text-(--color-primary) hover:text-(--color-accent) text-[16px] md:text-[17px] font-semibold leading-relaxed transition-colors"
                  >
                    casurajkumar1985@gmail.com
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Google Maps Location Section */}
      <section className="w-full flex justify-center pb-20 px-6 md:px-25 bg-[#fbfaf7]">
        <div className="max-w-360 w-full rounded-3xl overflow-hidden border border-gray-100 shadow-sm h-[400px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.7121361797617!2d77.322824175635!3d28.569068986959486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5d6d7a56c8f%3A0x252d22e32720e8f3!2sBuyUadvice!5e1!3m2!1sen!2sin!4v1787812883140!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="BuyUadvice Office Location"
          ></iframe>
        </div>
      </section>
    </>
  )
}

export default Contact