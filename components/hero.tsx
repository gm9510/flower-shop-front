"use client"

import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-secondary/20 to-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight text-balance">
            Celebrate Life's Beautiful Moments
          </h1>

          <p className="text-lg text-foreground/70 max-w-lg text-pretty">
            Handcrafted floral arrangements delivered with care. Perfect for any occasion, created by our expert
            florists using the freshest flowers.
          </p>

          <div className="flex gap-4 pt-4">
            <Link
              href="/shop"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors inline-block"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="relative w-80 h-80">
            <img
              src="/beautiful-fresh-flower-arrangement-bouquet.jpg"
              alt="Floral arrangement"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
