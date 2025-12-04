export default function About() {
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
