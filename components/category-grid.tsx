"use client"

import Link from "next/link"

export default function CategoryGrid() {
  const categories = [
    {
      id: 1,
      name: "Romantic Rose Bouquet",
      price: "$89.99",
      image: "/romantic-red-roses-bouquet.jpg",
      category: "Weddings",
    },
    {
      id: 2,
      name: "Sunflower Sunshine",
      price: "$79.99",
      image: "/vibrant-sunflower-arrangement.jpg",
      category: "Birthdays",
    },
    {
      id: 3,
      name: "Wedding Elegance",
      price: "$199.99",
      image: "/elegant-white-and-pink-wedding-flowers.jpg",
      category: "Weddings",
    },
    {
      id: 4,
      name: "Sympathy White Lilies",
      price: "$129.99",
      image: "/white-lilies-sympathy-arrangement.jpg",
      category: "Sympathy",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Featured Arrangements</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Discover our curated selection of stunning floral arrangements for every occasion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((item) => (
            <Link key={item.id} href={`/shop/${item.id}`} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-secondary/10 aspect-square mb-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-primary/70">{item.category}</p>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-lg font-bold text-primary">{item.price}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
