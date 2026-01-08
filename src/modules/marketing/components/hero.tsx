import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import heroImg from '../assets/home/hero.png'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Left: Content - 50% */}
          <div className="space-y-5 flex flex-col justify-center text-center lg:text-left">
            {/* Heading */}
            <h1 className="text-4xl  sm:text-4xl lg:text-4xl font-bold  leading-tight">
              TRANSFORM LOST & FOUND INTO 
              <span> </span>
              <span className="text-[#2885E1]">
              INTELLIGENT RECOVERY.
              </span>
            </h1>

            {/* <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold  leading-tight">
              Transform Lost
              & Found into Intelligent Recovery.
            </h1>
 */}
            {/* Description */}
            <p className="text-lg  leading-relaxed">
              Replace fragmented manual logs with a centralized AI-powered cloud
              platform. Designed for airports, malls, and universities to
              automate matching and maximize recovery rates.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center lg:justify-start lg:items-start">
              <Button
                asChild
                size="lg"
                className="bg-blue-500 hover:bg-[#2563EB] text-white text-base w-full sm:w-[280px] py-4 rounded-lg font-medium"
              >
                <Link to="/apply">Get started for free</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base w-full sm:w-[280px] py-4 rounded-lg border-gray-300 font-medium hover:bg-gray-50"
              >
                <Link to="/contact">Book a Demo</Link>
              </Button>
            </div>
          </div>

          {/* Right: Hero Image - 50% */}
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={heroImg}
              alt="Hero Img"
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
