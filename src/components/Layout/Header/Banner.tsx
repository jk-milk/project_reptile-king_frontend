function Banner({ titles }: { titles: string[] }) {
  return (
    <div className="relative w-full mt-16">
      <div className="w-full align-middle">
        <img src="/src/assets/banner.png" alt=""/>
      </div>
      <div className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2">
        <p className="text-center text-white font-bold text-2xl sm:text-4xl lg:text-6xl mb-4">{titles[0]}</p>
        <p className="text-center text-white font-bold text-xl sm:text-2xl lg:text-3xl">{titles[1]}</p>
      </div>
    </div>
  )
}

export default Banner