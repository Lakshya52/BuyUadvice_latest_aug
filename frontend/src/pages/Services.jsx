import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpRight, ChevronDown, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import data from '../data/data.json'
import iconMap from '../data/iconMap'
import Faq from '../components/Faq'
import Cta from '../components/Cta'

const categoryLabels = {
  registrations: 'Registrations & Licenses',
  trademark: 'Trademark',
  gst: 'GST',
  'income-tax': 'Income Tax',
  mca: 'MCA',
  compliance: 'Compliance',
  'foreign-accounting': 'Foreign Accounting',
  startup: 'Startup',
}

const Services = () => {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openCats, setOpenCats] = useState(() =>
    Object.fromEntries(Object.keys(data.services).map((category, index) => [category, index === 0]))
  )

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const result = {}
    for (const [cat, items] of Object.entries(data.services)) {
      if (selectedCategory !== 'all' && selectedCategory !== cat) continue
      const matches = items.filter(
        s =>
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.shortAbstract.toLowerCase().includes(q) ||
          categoryLabels[cat].toLowerCase().includes(q)
      )
      if (matches.length) result[cat] = matches
    }
    return result
  }, [query, selectedCategory])

  const resultCount = Object.values(filtered).reduce((total, items) => total + items.length, 0)
  const categoryEntries = Object.entries(data.services)
  const normalizedQuery = query.trim()

  const toggleCat = (cat) => {
    setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  const updateQuery = (nextQuery) => {
    setQuery(nextQuery)
    setOpenCats(
      Object.fromEntries(
        Object.keys(data.services).map((category, index) => [
          category,
          nextQuery.trim() ? true : index === 0,
        ])
      )
    )
  }

  return (
    <>
      <PageHeader
        compact
        heading="Our Services & Expertise"
        paragraph="Comprehensive tax, legal, and compliance solutions to empower your business growth. We handle the paperwork so you can focus on building your vision."
      />

      <div className="flex w-full flex-col items-center px-4 sm:px-8 lg:px-16 xl:px-25">
        <div className="sticky top-25 z-30 w-full max-w-360 bg-[#fbfaf7] py-5">
          <div className="relative w-full">
            <label htmlFor="service-search" className="sr-only">Search services</label>
            <Search size={20} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-(--color-primary)" />
            <input
              id="service-search"
              type="text"
              placeholder="Search services..."
              value={query}
              onChange={event => updateQuery(event.target.value)}
              className="w-full rounded-full bg-(--color-accent-light) py-3.5 pl-14 pr-14 text-base text-(--color-primary) shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
            />
            {query && (
              <button
                type="button"
                onClick={() => updateQuery('')}
                aria-label="Clear service search"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-(--color-primary) hover:bg-white focus-visible:outline-2 focus-visible:outline-(--color-primary)"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <nav aria-label="Filter services by category" className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={selectedCategory === 'all'}
              onClick={() => {
                setSelectedCategory('all')
                setOpenCats(prev => ({ ...prev, [categoryEntries[0][0]]: true }))
              }}
              className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-(--color-primary) ${selectedCategory === 'all' ? 'border-(--color-primary) bg-(--color-primary) text-white' : 'border-gray-300 bg-white text-(--color-primary) hover:border-(--color-primary)'}`}
            >
              All services
            </button>
            {categoryEntries.map(([category, items]) => (
              <button
                key={category}
                type="button"
                aria-pressed={selectedCategory === category}
                onClick={() => {
                  setSelectedCategory(category)
                  setOpenCats(prev => ({ ...prev, [category]: true }))
                }}
                className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-(--color-primary) ${selectedCategory === category ? 'border-(--color-primary) bg-(--color-primary) text-white' : 'border-gray-300 bg-white text-(--color-primary) hover:border-(--color-primary)'}`}
              >
                {categoryLabels[category] || category}
                <span className="ml-1.5 opacity-70">({items.length})</span>
              </button>
            ))}
          </nav>
          <p aria-live="polite" className="mt-1 text-sm text-(--color-gray)">
            {resultCount} {resultCount === 1 ? 'service' : 'services'}
            {normalizedQuery && <> matching “{normalizedQuery}”</>}
          </p>
        </div>

        <div className="flex w-full max-w-360 flex-col py-8">
          {Object.entries(filtered).map(([cat, items]) => {
            const isOpen = openCats[cat]
            const categoryId = `services-${cat}`
            return (
              <section key={cat} id={categoryId} className="overflow-hidden border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => toggleCat(cat)}
                  aria-expanded={isOpen}
                  aria-controls={`${categoryId}-services`}
                  className={`group flex w-full items-center justify-between border-l-4 border-l-(--color-primary) bg-white p-5 text-left transition-colors duration-300 hover:bg-(--color-accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) sm:p-8 ${isOpen ? 'text-(--color-accent)' : 'text-(--color-black)'}`}
                >
                  <span className="heading text-left text-2xl sm:text-3xl">
                    {categoryLabels[cat] || cat} <span className="ml-2 text-base font-normal text-gray-400">({items.length})</span>
                  </span>
                  <span className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={22} strokeWidth={2.5} />
                  </span>
                </button>

                <div
                  id={`${categoryId}-services`}
                  hidden={!isOpen}
                >
                    <div className="mb-10 mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {items.map(service => (
                        <Link
                          to={`/services/${service.id}`}
                          key={service.id}
                          className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(47,164,169,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) sm:p-7"
                        >
                          <div className="shine-bar"></div>
                          <div className="mb-4 text-(--color-accent)">
                            {iconMap[service.icon] ? React.createElement(iconMap[service.icon], { size: 26, strokeWidth: 1.75 }) : null}
                          </div>
                          <h3 className="mb-3 text-lg font-semibold text-(--color-black)">{service.title}</h3>
                          <p className="mb-6 grow text-sm leading-relaxed text-(--color-gray)">{service.shortAbstract}</p>
                          <span className="flex items-center gap-2 text-sm font-semibold text-(--color-black)">
                            Learn more <ArrowUpRight size={18} strokeWidth={2.5} className="text-(--color-accent)" />
                          </span>
                        </Link>
                      ))}
                    </div>
                </div>
              </section>
            )
          })}
          {Object.keys(filtered).length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold text-(--color-primary)">No services found</p>
              <p className="mt-2 text-(--color-gray)">Try a different search or browse all categories.</p>
              <button
                type="button"
                onClick={() => {
                  updateQuery('')
                  setSelectedCategory('all')
                }}
                className="mt-5 rounded-full bg-(--color-primary) px-5 py-2.5 text-sm font-semibold text-white hover:bg-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
              >
                Show all services
              </button>
            </div>
          )}
        </div>
      </div>

      <Faq />
      <Cta />
    </>
  )
}

export default Services