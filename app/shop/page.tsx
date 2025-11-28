"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"

// Hero Section
function Hero({ onNavigate }: { onNavigate: (view: string) => void }) {
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
            <button
              onClick={() => onNavigate("products")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Shop Now
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="relative w-80 h-80">
            <img
              src="/beautiful-fresh-flower-arrangement-bouquet.jpg"
              alt="Beautiful floral arrangement"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// Products View
function ProductsView({
  onNavigate,
  onAddToCart,
}: {
  onNavigate: (view: string, productId?: number) => void
  onAddToCart: (product: { id: number; name: string; price: number; image: string }, quantity: number) => void
}) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const products = [
    {
      id: 1,
      name: "Romantic Rose Bouquet",
      price: 89.99,
      image: "/romantic-red-roses-bouquet.jpg",
      category: "Weddings",
    },
    {
      id: 2,
      name: "Sunflower Sunshine",
      price: 79.99,
      image: "/vibrant-sunflower-arrangement.jpg",
      category: "Birthdays",
    },
    {
      id: 3,
      name: "Wedding Elegance",
      price: 199.99,
      image: "/elegant-white-and-pink-wedding-flowers.jpg",
      category: "Weddings",
    },
    {
      id: 4,
      name: "Sympathy White Lilies",
      price: 129.99,
      image: "/white-lilies-sympathy-arrangement.jpg",
      category: "Sympathy",
    },
    {
      id: 5,
      name: "Birthday Rainbow Mix",
      price: 99.99,
      image: "/colorful-rainbow-mixed-flower-arrangement.jpg",
      category: "Birthdays",
    },
    {
      id: 6,
      name: "Classic Tulips",
      price: 69.99,
      image: "/classic-pink-tulips-arrangement.jpg",
      category: "All",
    },
  ]

  const categories = ["All", "Weddings", "Birthdays", "Sympathy"]
  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory)

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-primary mb-8">Shop Our Collection</h1>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/20 text-foreground hover:bg-secondary/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <button onClick={() => onNavigate("detail", product.id)} className="block w-full text-left">
              <div className="relative overflow-hidden bg-secondary/10 aspect-square group">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </button>

            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-1">{product.name}</h3>
                <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product, 1)
                }}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Product Detail View
function ProductDetailView({
  productId,
  onNavigate,
  onAddToCart,
}: {
  productId: number
  onNavigate: (view: string) => void
  onAddToCart: (product: { id: number; name: string; price: number; image: string }, quantity: number) => void
}) {
  const [quantity, setQuantity] = useState(1)

  const products = [
    {
      id: 1,
      name: "Romantic Rose Bouquet",
      price: 89.99,
      image: "/romantic-red-roses-bouquet.jpg",
      description: "A stunning arrangement of premium red roses perfect for expressing your deepest feelings.",
      features: ["12 Premium Red Roses", "Lush Greenery", "Free Delivery", "Handcrafted Design"],
    },
    {
      id: 2,
      name: "Sunflower Sunshine",
      price: 79.99,
      image: "/vibrant-sunflower-arrangement.jpg",
      description: "Bright and cheerful sunflowers to bring warmth and joy to any space.",
      features: ["10 Golden Sunflowers", "Premium Vase", "Free Delivery", "Long Lasting"],
    },
    {
      id: 3,
      name: "Wedding Elegance",
      price: 199.99,
      image: "/elegant-white-and-pink-wedding-flowers.jpg",
      description: "A sophisticated arrangement designed specifically for weddings and formal events.",
      features: ["Premium Florals", "Luxury Packaging", "Delivery & Setup", "Custom Design Available"],
    },
    {
      id: 4,
      name: "Sympathy White Lilies",
      price: 129.99,
      image: "/white-lilies-sympathy-arrangement.jpg",
      description: "Elegant white lilies expressing your condolences with grace and respect.",
      features: ["Premium White Lilies", "Sympathy Arrangement", "Free Delivery", "Respectful Design"],
    },
    {
      id: 5,
      name: "Birthday Rainbow Mix",
      price: 99.99,
      image: "/colorful-rainbow-mixed-flower-arrangement.jpg",
      description: "A vibrant mix of colorful flowers perfect for birthday celebrations.",
      features: ["Mixed Rainbow Flowers", "Festive Design", "Free Delivery", "Joy & Happiness"],
    },
    {
      id: 6,
      name: "Classic Tulips",
      price: 69.99,
      image: "/classic-pink-tulips-arrangement.jpg",
      description: "Beautiful pink tulips in a classic arrangement for timeless elegance.",
      features: ["Premium Pink Tulips", "Classic Design", "Free Delivery", "Fresh & Beautiful"],
    },
  ]

  const product = products.find((p) => p.id === productId)

  if (!product) return null

  return (
    <div className="max-w-6xl mx-auto px-4">
      <button onClick={() => onNavigate("products")} className="mb-6 text-primary hover:text-primary/80 font-semibold">
        ← Back to Shop
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex items-center justify-center bg-secondary/10 rounded-lg p-8">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-auto rounded-lg" />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-primary">${product.price}</p>
          </div>

          <p className="text-foreground/80">{product.description}</p>

          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Features:</h3>
            <ul className="space-y-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-foreground/80">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <label className="font-semibold text-primary">Quantity:</label>
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-secondary/10"
              >
                −
              </button>
              <span className="px-4 py-2 font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-secondary/10">
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              onAddToCart(product, quantity)
              setQuantity(1)
            }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// Cart View
function CartView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const { items, removeFromCart, updateQuantity } = useCart()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax + 9.99

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-primary mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground/60 mb-4">Your cart is empty</p>
          <button onClick={() => onNavigate("products")} className="text-primary hover:text-primary/80 font-semibold">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border border-border rounded-lg p-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-1">{item.name}</h3>
                  <p className="text-foreground/60">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 hover:bg-secondary/10"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-secondary/10"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive hover:text-destructive/80 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-secondary/5 border border-border rounded-lg p-6 h-fit">
            <h3 className="font-semibold text-primary mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>$9.99</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// About View
function AboutView() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-primary mb-6">About Bloom & Petals</h1>

      <div className="space-y-6 text-foreground/80">
        <p>
          Since 1995, Bloom & Petals has been delivering joy through beautiful floral arrangements. Our passion for
          flowers and commitment to excellence has made us a trusted choice for thousands of customers.
        </p>

        <div className="grid md:grid-cols-3 gap-6 my-8">
          <div className="bg-secondary/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <p className="text-foreground/70">Happy Customers Daily</p>
          </div>
          <div className="bg-secondary/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-primary mb-2">30 Years</div>
            <p className="text-foreground/70">Industry Experience</p>
          </div>
          <div className="bg-secondary/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <p className="text-foreground/70">Fresh Flowers</p>
          </div>
        </div>

        <p>
          Each arrangement is handcrafted with premium flowers sourced from the finest growers. We believe that flowers
          are nature's way of expressing emotions, and we're honored to help you share those moments.
        </p>

        <div className="mt-8 space-y-2">
          <h3 className="text-xl font-semibold text-primary">Contact Us</h3>
          <p>Email: hello@bloompetals.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Address: 123 Garden Lane, Flower City, FC 12345</p>
        </div>
      </div>
    </div>
  )
}

// Main Shop SPA Component
export default function ShopPage() {
  const [currentView, setCurrentView] = useState<"home" | "products" | "detail" | "cart" | "about">("home")
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleNavigate = (view: string, productId?: number) => {
    setCurrentView(view as any)
    if (productId) {
      setSelectedProductId(productId)
    }
  }

  const handleAddToCart = (product: { id: number; name: string; price: number; image: string }, quantity: number) => {
    addToCart(product, quantity)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onNavigate={handleNavigate} />

      <main className="py-12">
        {currentView === "home" && <Hero onNavigate={handleNavigate} />}
        {currentView === "products" && <ProductsView onNavigate={handleNavigate} onAddToCart={handleAddToCart} />}
        {currentView === "detail" && selectedProductId && (
          <ProductDetailView productId={selectedProductId} onNavigate={handleNavigate} onAddToCart={handleAddToCart} />
        )}
        {currentView === "cart" && <CartView onNavigate={handleNavigate} />}
        {currentView === "about" && <AboutView />}
      </main>
    </div>
  )
}
