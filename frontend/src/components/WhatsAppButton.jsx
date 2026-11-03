import { useLocation } from 'react-router-dom';
import data from '../data/data.json';

const servicesById = Object.values(data.services)
  .flat()
  .reduce((services, service) => {
    services[service.id] = service;
    return services;
  }, {});

const WhatsAppButton = () => {
  const { pathname } = useLocation();
  const serviceId = pathname.match(/^\/services\/([^/]+)\/?$/)?.[1];
  const service = serviceId ? servicesById[serviceId] : null;
  const message = service
    ? `Hi, I'm interested in ${service.title}.`
    : "Hi, I'd like to know more about BuyUadvice's services.";

  return (
    <a
      href={`https://wa.me/919540270350?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      aria-label={service ? `Contact us on WhatsApp about ${service.title}` : 'Contact us on WhatsApp'}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] transition hover:-translate-y-0.5 hover:bg-[#1fbd5b] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30 sm:bottom-7 sm:right-7 sm:px-5"
    >
      <img src="/whatsapp.svg" alt="" aria-hidden="true" className="h-[21px] w-[21px]" />
      WhatsApp
    </a>
  );
};

export default WhatsAppButton;
