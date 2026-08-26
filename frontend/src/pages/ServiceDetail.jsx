import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Check, ArrowRight, ArrowLeft, ShieldCheck, ClipboardList, CircleCheckBig } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import data from '../data/data.json';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openLogin } = useAuth();

  const allServices = Object.values(data.services).flat();
  const service = allServices.find(s => s.id === id);

  if (!service) {
    return (
      <>
        <PageHeader heading="Service Not Found" paragraph="The service you're looking for doesn't exist." />
        <div className="flex flex-col items-center justify-center py-20 px-25">
          <button onClick={() => navigate('/services')} className="flex items-center gap-2 text-(--color-primary) font-semibold hover:underline cursor-pointer">
            <ArrowLeft size={18} /> Back to Services
          </button>
        </div>
      </>
    );
  }

  const handleGetStarted = () => {
    if (!user) {
      openLogin();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <PageHeader heading={service.title} paragraph={service.shortAbstract} />

      <div className="w-full px-25 py-16">
        <div className="max-w-360 mx-auto w-full">

          {/* Back */}
          <button onClick={() => navigate('/services')} className="flex items-center gap-2 text-[14px] text-gray-500 hover:text-(--color-primary) transition-colors mb-10 cursor-pointer">
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to Services
          </button>

          {/* Service Images */}
          <div className="flex flex-col sm:flex-row gap-5 mb-14">
            <div className="flex-[3] overflow-hidden rounded-3xl">
              <img
                src={`https://picsum.photos/seed/${service.id}-a/800/500`}
                alt={service.title}
                className="w-full h-full object-cover min-h-[280px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <div className="flex-[2] overflow-hidden rounded-3xl">
              <img
                src={`https://picsum.photos/seed/${service.id}-b/600/500`}
                alt={`${service.title} - details`}
                className="w-full h-full object-cover min-h-[280px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Left Content */}
            <div className="flex-1 min-w-0">

              {/* What is this service */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-(--color-primary) flex items-center justify-center">
                    <CircleCheckBig size={20} className="text-white" />
                  </div>
                  <h2 className="text-[26px] font-bold text-(--color-primary)">{service.heading1}</h2>
                </div>
                <p className="text-[16px] text-(--color-gray) leading-[1.85] pl-[52px]">{service.paragraph1}</p>
              </div>

              {/* Bullets */}
              {service.bullets && service.bullets.length > 0 && (
                <div className="mb-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-center gap-3 bg-linear-to-r from-(--color-accent-light) to-white rounded-2xl px-6 py-5 border border-(--color-accent)/10">
                        <div className="w-9 h-9 rounded-full bg-(--color-accent) flex items-center justify-center shrink-0 shadow-sm">
                          <Check size={16} className="text-white" strokeWidth={3} />
                        </div>
                        <span className="text-[15px] font-semibold text-(--color-primary)">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-12"></div>

              {/* How we assist */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <h2 className="text-[26px] font-bold text-(--color-primary)">{service.heading2}</h2>
                </div>
                <p className="text-[16px] text-(--color-gray) leading-[1.85] pl-[52px]">{service.paragraph2}</p>
              </div>

              {/* Required Documents */}
              {service.documents && service.documents.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
                      <FileText size={20} className="text-white" />
                    </div>
                    <h2 className="text-[24px] font-bold text-(--color-primary)">Required Documents</h2>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.documents.map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 border border-gray-100 hover:border-[var(--color-accent)]/30 hover:shadow-sm transition-all duration-200">
                          <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                            <span className="text-white text-[11px] font-bold">{String(i + 1).padStart(2, '0')}</span>
                          </div>
                          <span className="text-[14px] text-[#333] font-medium">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Sticky Sidebar - Pricing */}
            <div className="w-full lg:w-[340px] shrink-0">
              <div className="lg:sticky lg:top-28">
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                  {/* Accent top bar */}
                  <div className="h-1.5 bg-linear-to-r from-[var(--color-accent)] to-[var(--color-primary)]"></div>

                  <div className="p-8">
                    <div className="mb-6">
                      <p className="text-[13px] text-gray-400 uppercase tracking-wider font-medium mb-2">Starting at</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[16px] text-(--color-primary) font-semibold">₹</span>
                        <span className="text-[42px] font-bold text-(--color-primary) leading-none">{service.price.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[13px] text-gray-400 mt-1">+ applicable taxes</p>
                    </div>

                    {/* What's included */}
                    <div className="border-t border-gray-100 pt-6 mb-8">
                      <p className="text-[13px] text-gray-500 font-semibold uppercase tracking-wider mb-4">What's included</p>
                      <div className="flex flex-col gap-3">
                        {service.bullets && service.bullets.slice(0, 4).map((bullet, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                              <Check size={12} className="text-[var(--color-accent)]" strokeWidth={3} />
                            </div>
                            <span className="text-[14px] text-(--color-gray)">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={handleGetStarted}
                      className="w-full flex items-center justify-center gap-2 bg-(--color-primary) hover:bg-(--color-primary-dark) text-white rounded-full py-[14px] font-medium text-[16px] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      {user ? 'Go to Dashboard' : 'Get Started'}
                      <ArrowRight size={18} />
                    </button>

                    {!user && (
                      <p className="text-[12px] text-gray-400 mt-3 text-center">Login or sign up to avail this service</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default ServiceDetail;
