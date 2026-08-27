import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FileText, Check, ArrowRight, ArrowLeft, ShieldCheck, ClipboardList, CircleCheckBig } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import data from '../data/data.json';
import iconMap from '../data/iconMap';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openLogin } = useAuth();

  const allServices = Object.values(data.services).flat();
  const service = allServices.find(s => s.id === id);

  const currentCategory = Object.keys(data.services).find(key =>
    data.services[key].some(s => s.id === id)
  );
  const relatedServices = currentCategory
    ? data.services[currentCategory].filter(s => s.id !== id).slice(0, 4)
    : [];

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

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Left Content */}
            <div className="flex-1 min-w-0">

              {/* What is this service */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-[26px] font-bold text-(--color-primary)">{service.heading1}</h2>
                </div>
                <p className="text-[16px] text-(--color-gray) leading-[1.85]">{service.paragraph1}</p>
              </div>

              {/* Service Images */}
              <div className="flex flex-col sm:flex-row gap-5 mb-10">
                <div className="flex-[3] overflow-hidden rounded-3xl">
                  <img
                    src={`https://picsum.photos/seed/${service.id}-a/800/500`}
                    alt={service.title}
                    className="w-full h-full object-cover min-h-[240px] hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <div className="flex-[2] overflow-hidden rounded-3xl">
                  <img
                    src={`https://picsum.photos/seed/${service.id}-b/600/500`}
                    alt={`${service.title} - details`}
                    className="w-full h-full object-cover min-h-[240px] hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
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
                  {/* <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
                    <ShieldCheck size={20} className="text-white" />
                  </div> */}
                  <h2 className="text-[26px] font-bold text-(--color-primary)">{service.heading2}</h2>
                </div>
                <p className="text-[16px] text-(--color-gray) leading-[1.85]">{service.paragraph2}</p>
              </div>

              {/* Required Documents */}
              {service.documents && service.documents.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-[24px] font-bold text-(--color-primary)">Required Documents</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.documents.map((doc, i) => (
                      <div key={i} className="flex items-center gap-3 bg-linear-to-r from-(--color-accent-light) to-white rounded-2xl px-6 py-5 border border-(--color-accent)/10">
                        <div className="w-9 h-9 rounded-full bg-(--color-accent) flex items-center justify-center shrink-0 shadow-sm">
                          <span className="text-white text-[12px] font-bold">{i + 1}</span>
                        </div>
                        <span className="text-[15px] font-semibold text-(--color-primary)">{doc}</span>
                      </div>
                    ))}
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

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <div className="mt-20">
              <div className="border-t border-gray-200 mb-12"></div>
              <h2 className="text-[26px] font-bold text-(--color-primary) mb-8">Related Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedServices.map((related) => (
                  <Link
                    key={related.id}
                    to={`/services/${related.id}`}
                    className="card-shine group flex flex-col p-6 bg-white rounded-[24px] border border-gray-200 hover:-translate-y-2 hover:shadow-[0_8px_64px_rgba(47,164,169,0.25)] transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="shine-bar"></div>
                    <div className="mb-3 text-(--color-accent)">
                      {iconMap[related.icon] ? React.createElement(iconMap[related.icon], { size: 24, strokeWidth: 1.75 }) : null}
                    </div>
                    <h3 className="text-[17px] font-bold text-(--color-primary) mb-2">{related.title}</h3>
                    <p className="text-[13px] text-(--color-gray) leading-relaxed mb-5 line-clamp-3">{related.shortAbstract}</p>
                    <div className="flex items-center gap-1 text-[14px] font-semibold text-(--color-accent) mt-auto group-hover:gap-2 transition-all duration-300">
                      View Details <ArrowRight size={16} />
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/services" className="group flex items-center gap-0 justify-center mt-8 text-[15px] font-semibold text-(--color-primary) hover:text-(--color-accent) transition-colors duration-300 cursor-pointer">
                View All Services <span className="inline-block w-0 overflow-hidden opacity-0 group-hover:w-5 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300"><ArrowRight size={18} /></span>
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ServiceDetail;
