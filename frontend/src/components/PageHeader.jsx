const PageHeader = ({ heading, paragraph, compact = false }) => {
  return (
    <div className={`relative ${compact ? 'h-[38dvh] min-h-[280px] max-h-[440px] px-4 sm:px-8 lg:px-16 xl:px-25' : 'h-[50dvh] px-25'} flex w-full items-center justify-start overflow-hidden bg-[url('/HeaderBgEffects.svg')] bg-cover bg-center bg-no-repeat`}>
      <div className="max-w-360 mx-auto w-full">
        <h1 className={`heading mb-4 w-full text-left ${compact ? 'text-3xl sm:text-4xl lg:text-[46px]' : ''}`}>{heading}</h1>
        <p className={`para w-full text-left ${compact ? 'max-w-3xl text-base sm:text-lg lg:text-[21px]' : ''}`}>{paragraph}</p>
      </div>
    </div>
  )
}

export default PageHeader
