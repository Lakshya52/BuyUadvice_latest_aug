import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpRight, ChevronDown } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import data from '../data/data.json'
import Faq from '../components/Faq'

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
  const [openCats, setOpenCats] = useState(() =>
    Object.fromEntries(Object.keys(data.services).map(k => [k, true]))
  )

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return data.services
    const result = {}
    for (const [cat, items] of Object.entries(data.services)) {
      const matches = items.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.shortAbstract.toLowerCase().includes(q)
      )
      if (matches.length) result[cat] = matches
    }
    return result
  }, [query])

  const toggleCat = (cat) => {
    setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  return (
    <>

    
      <PageHeader
        heading="Our Services & Expertise"
        paragraph="Comprehensive tax, legal, and compliance solutions to empower your business growth. We handle the paperwork so you can focus on building your vision."
      />

      <div className='px-25 flex items-center justify-center w-full flex-col  '>
        {/* search bar */}
        <div className="w-full max-w-360 sticky top-[70px] z-30 py-10 bg-(--color-white) " >
          <div className="relative w-full">
            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-(--color-primary) pointer-events-none" />
            <input
              autoFocus
              type="text"
              placeholder="Search services..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-(--color-accent-light) text-(--color-primary) placeholder-(--color-primary) rounded-full py-4 pl-16 pr-8 text-xl outline-none shadow-lg"
            />
          </div>
        </div>

        {/* services accordion */}
        <div className="w-full max-w-360  py-16 flex flex-col ">
          {Object.entries(filtered).map(([cat, items]) => {
            const isOpen = openCats[cat]
            return (
              <div
                key={cat}
                className={`transition-all duration-300 overflow-hidden `}
              >
                <button
                  onClick={() => toggleCat(cat)}
                  className={`group w-full outline-none flex items-center justify-between p-8 text-left bg-white transition-colors duration-300 cursor-pointer border-l-4 ${isOpen ? 'border-l-(--color-primary)' : 'border-l-(--color-primary) hover:bg-(--color-accent-light)'}`}
                >
                  <span className={`heading  ${isOpen ? 'text-(--color-accent)' : 'text-[#1a1a1a] group-hover:text-(--color-primary) '}`} >
                    {categoryLabels[cat] || cat} <span className="text-[19px] font-normal text-gray-400 ml-2">({items.length})</span>
                  </span>
                  <span className={`shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 text-(--color-accent)' : 'text-gray-400 group-hover:text-(--color-primary)'}`}>
                    <ChevronDown size={22} strokeWidth={2.5} />
                  </span>
                </button>

                <div className={`transition-all duration-300 ${isOpen ? 'max-h-[5000px]' : 'max-h-0'}`}>
                  <div className=" mb-20 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-10">
                      {items.map(service => (
                        <Link
                          to={`/services/${service.id}`}
                          key={service.id}
                          className="flex flex-col p-8 bg-white rounded-3xl border border-gray-200 hover:-translate-y-2 hover:shadow-[0_8px_64px_rgba(47,164,169,0.25)] transition-all duration-300 cursor-pointer"
                        >
                          <h3 className="text-[19px] font-semibold text-[#1a1a1a] mb-3">{service.title}</h3>
                          <p className="text-[#666666] text-[15px] leading-relaxed mb-6 grow">{service.shortAbstract}</p>
                          <span className="flex items-center gap-2 text-[15px] font-semibold text-[#1a1a1a]">
                            Learn more <ArrowUpRight size={18} strokeWidth={2.5} className="text-(--color-accent)" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {Object.keys(filtered).length === 0 && (
            <p className="text-center text-[#666] text-[17px] py-10">No services found matching "{query}"</p>
          )}
        </div>


      </div>

      <Faq />
    </>
  )
}

export default Services