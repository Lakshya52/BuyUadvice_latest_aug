import React from 'react'

const PageHeader = ({ heading, paragraph }) => {
  return (
    <div className="relative h-[50dvh] bg-[url('/HeaderBgEffects.svg')] bg-cover bg-no-repeat bg-center flex items-center justify-start w-full overflow-hidden px-25 ">
      <div className="max-w-360 mx-auto w-full">
        <h1 className="heading mb-4 w-full text-left">{heading}</h1>
        <p className="para w-full text-left">{paragraph}</p>
      </div>
    </div>
  )
}

export default PageHeader
