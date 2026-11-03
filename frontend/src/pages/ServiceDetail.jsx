import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import data from '../data/data.json';

const categoryLabels = {
  registrations: 'Registrations & Licenses',
  trademark: 'Trademark',
  gst: 'GST',
  'income-tax': 'Income Tax',
  mca: 'MCA',
  compliance: 'Compliance',
  'foreign-accounting': 'Foreign Accounting',
  startup: 'Startup',
};

const formatPrice = (price) => Number(price).toLocaleString('en-IN');

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openLogin } = useAuth();

  const allServices = Object.values(data.services).flat();
  const service = allServices.find((item) => item.id === id);
  const currentCategory = Object.keys(data.services).find((key) =>
    data.services[key].some((item) => item.id === id)
  );
  const categoryServices = currentCategory ? data.services[currentCategory] : [];
  const pricingServices = service
    ? [service, ...categoryServices.filter((item) => item.id !== id)].slice(0, 3)
    : [];
  const relatedServices = categoryServices.filter((item) => item.id !== id);

  const handleGetStarted = () => {
    if (!user) {
      openLogin();
      return;
    }

    navigate('/dashboard');
  };

  if (!service) {
    return (
      <>
        <section className="bg-white px-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-(--color-primary)">Service not found</h1>
          <p className="mt-4 text-(--color-gray)">The service you’re looking for doesn’t exist.</p>
          <button
            onClick={() => navigate('/services')}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-(--color-primary) px-6 py-3 font-semibold text-white transition-colors hover:bg-(--color-primary-dark)"
          >
            <ArrowLeft size={18} />
            Back to Services
          </button>
        </section>
      </>
    );
  }

  return (
    <>
      <main className="bg-white">
        <section className="relative overflow-hidden border-b rounded-b-[80px] border-slate-100 bg-linear-to-t from-(--color-accent-dark)/40 to-white px-6 pb-14 pt-8 md:px-10 md:pb-16">
          <div className="relative z-10 mx-auto max-w-7xl">
            <Link
              to="/services"
              className="inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-(--color-primary)"
            >
              <ArrowLeft size={16} />
              All services
            </Link>

            <div className="mx-auto mt-7 max-w-4xl text-center sm:mt-9">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-(--color-accent-dark)">
                Business compliance, made simpler
              </p>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-(--color-primary) sm:text-4xl">
                <span className="text-(--color-accent-dark)">{service.title}</span> with expert support
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                {service.shortAbstract}
              </p>
              <a
                href="#pricing"
                className="mx-auto mt-5 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-lg border border-(--color-accent) bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm transition hover:bg-(--color-accent-light)/50"
              >
                <span>Get started from</span>
                <strong className="font-bold text-(--color-primary)">₹{formatPrice(service.price)}</strong>
                <span className="text-slate-500">+ applicable taxes</span>
                <span className="font-semibold text-(--color-accent-dark) underline underline-offset-4">View pricing</span>
              </a>
            </div>

            <div className="mx-auto mt-7 max-w-6xl rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_18px_48px_rgba(24,43,79,0.10)] sm:mt-9 sm:p-8 lg:p-10">
              <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                <div className="flex flex-col justify-center">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-accent-light) text-(--color-accent-dark)">
                    <ClipboardCheck size={21} />
                  </div>
                  <h2 className="text-xl font-semibold text-(--color-primary) sm:text-2xl">
                    Apply for {service.title}
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Get clear guidance at every step, from preparing your application to understanding what comes next.
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                    {(service.bullets || []).slice(0, 5).map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-accent-light) text-(--color-accent-dark)">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-center rounded-2xl bg-slate-50 p-5 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-(--color-accent-dark) shadow-sm">
                      <ShieldCheck size={21} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-(--color-primary)">Expert support, from start to finish</p>
                      <p className="mt-0.5 text-xs text-slate-500">A simple place to get your application moving</p>
                    </div>
                  </div>
                  <div className="my-5 border-t border-slate-200" />
                  <p className="text-sm leading-6 text-slate-600">
                    Start your application online and get guidance on the requirements for your business.
                  </p>
                  <button
                    onClick={handleGetStarted}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-(--color-primary) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--color-primary-dark) focus:outline-none focus-visible:ring-4 focus-visible:ring-(--color-accent-light)"
                  >
                    {user ? 'Go to Dashboard' : 'Continue'}
                    <ArrowRight size={17} />
                  </button>
                  {!user && (
                    <p className="mt-2 text-center text-xs text-slate-400">
                      Sign in or create an account to continue
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, title: 'Expert guidance', detail: 'Support for your application' },
                  { icon: IndianRupee, title: 'Clear pricing', detail: 'See the price before you start' },
                  { icon: FileText, title: 'Document support', detail: 'Know what to prepare' },
                ].map(({ icon: Icon, title, detail }) => (
                  <div key={title} className="flex items-center gap-3 bg-white px-4 py-3 sm:justify-center sm:px-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-accent-light) text-(--color-accent-dark)">
                      <Icon size={17} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-(--color-primary)">{title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-10 px-6 py-16 sm:px-10 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-(--color-accent)">
                {categoryLabels[currentCategory] || currentCategory}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-(--color-primary) sm:text-4xl">
                Explore services and pricing
              </h2>
              <p className="mt-3 text-slate-500">
                Choose the service that fits your needs. Prices shown are starting prices.
              </p>
            </div>

            <div className="grid items-stretch gap-6 lg:grid-cols-3">
              {pricingServices.map((item) => {
                const isCurrentService = item.id === service.id;

                return (
                  <article
                    key={item.id}
                    className={`relative flex flex-col rounded-3xl bg-white p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] sm:p-8 ${
                      isCurrentService
                        ? 'border border-(--color-accent) ring-1 ring-(--color-accent-light)'
                        : 'border border-slate-100'
                    }`}
                  >
                    {isCurrentService && (
                      <span className="absolute -top-3 left-7 rounded-full bg-(--color-primary) px-3 py-1 text-xs font-bold text-white shadow-sm">
                        Most Seen
                      </span>
                    )}
                    <h3 className="mt-2 text-xl font-semibold text-(--color-primary)">{item.title}</h3>
                    <p className="mt-3 min-h-16 text-sm leading-6 text-slate-500">{item.shortAbstract}</p>
                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Starting at</p>
                      <p className="mt-1 text-3xl font-bold text-(--color-primary)">
                        ₹{formatPrice(item.price)}
                      </p>
                      <p className="text-xs text-slate-400">+ applicable taxes</p>
                    </div>
                    <div className="mt-6">
                      <p className="mb-4 text-sm font-semibold text-slate-600">What’s included:</p>
                      <ul className="space-y-3">
                        {(item.bullets || []).slice(0, 5).map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-500">
                            <Check size={17} className="mt-0.5 shrink-0 text-(--color-accent-dark)" strokeWidth={2.5} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-auto pt-8">
                      {isCurrentService ? (
                        <button
                          onClick={handleGetStarted}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-5 py-3.5 font-bold text-white transition hover:bg-(--color-primary-dark)"
                        >
                          Start this service <ArrowRight size={17} />
                        </button>
                      ) : (
                        <Link
                          to={`/services/${item.id}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-(--color-accent)/30 bg-(--color-accent-light) px-5 py-3.5 font-bold text-(--color-primary) transition hover:bg-(--color-accent-light)/70"
                        >
                          View service <ArrowRight size={17} />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f8fafc] px-6 py-16 sm:px-10 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <article className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm sm:p-9">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-(--color-accent)">The service</p>
                <h2 className="mt-3 text-2xl font-semibold text-(--color-primary)">{service.heading1}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{service.paragraph1}</p>
              </article>
              <article className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm sm:p-9">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-(--color-accent)">How we help</p>
                <h2 className="mt-3 text-2xl font-semibold text-(--color-primary)">{service.heading2}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{service.paragraph2}</p>
              </article>
            </div>

            {service.documents?.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(24,43,79,0.06)]">
                <div className="flex flex-col gap-4 bg-linear-to-r from-(--color-accent-light)/55 via-white to-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-(--color-primary) shadow-sm ring-1 ring-(--color-accent)/15">
                      <FileText size={22} />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-(--color-accent-dark)">Get prepared</p>
                      <h2 className="mt-1 text-xl font-semibold text-(--color-primary) sm:text-2xl">Documents you may need</h2>
                    </div>
                  </div>
                  <p className="max-w-sm text-sm leading-6 text-slate-500 sm:text-right">
                    Keep these documents handy to help your application move smoothly.
                  </p>
                </div>
                <ul className="grid gap-3 border-t border-slate-100 bg-slate-50/60 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
                  {service.documents.map((document) => (
                    <li key={document} className="flex min-h-14 items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm leading-5 text-slate-600 transition-colors hover:border-(--color-accent)/40 hover:bg-(--color-accent-light)/25">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-accent-light) text-(--color-accent-dark)">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span>{document}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedServices.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <h2 className="border-b border-slate-200 px-6 py-5 text-lg font-semibold text-(--color-primary) sm:px-8">
                  Related services — {categoryLabels[currentCategory] || currentCategory}
                </h2>
                <div className="flex flex-wrap gap-2.5 p-6 sm:p-8">
                  {relatedServices.map((related) => (
                    <Link
                      key={related.id}
                      to={`/services/${related.id}`}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-600 transition hover:border-(--color-accent) hover:bg-emerald-50 hover:text-(--color-primary)"
                    >
                      {related.title}
                    </Link>
                  ))}
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-(--color-primary) transition hover:border-(--color-accent) hover:bg-emerald-50"
                  >
                    All services <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default ServiceDetail;
