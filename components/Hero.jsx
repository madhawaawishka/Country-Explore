import { Globe } from "lucide-react"

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
      <div className="absolute inset-0 bg-[url('/world-map-dots.png')] bg-no-repeat bg-center bg-cover opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Globe className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Explore Our Worlds
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
            Discover detailed information about countries around the globe. From populations to languages, flags to
            capitals - your journey starts here.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href="#countries"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
            >
              Start Exploring
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
