import React from 'react';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Flower Shop
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Browse our beautiful collection of fresh flowers
          </p>
        </div>

        {/* Placeholder for flower categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="h-48 bg-pink-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-pink-500 text-lg font-semibold">Roses</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Roses</h3>
            <p className="text-gray-600">Beautiful fresh roses for any occasion</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="h-48 bg-yellow-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-yellow-500 text-lg font-semibold">Sunflowers</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Bright Sunflowers</h3>
            <p className="text-gray-600">Cheerful sunflowers to brighten your day</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="h-48 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-purple-500 text-lg font-semibold">Tulips</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Elegant Tulips</h3>
            <p className="text-gray-600">Classic tulips in various colors</p>
          </div>
        </div>

        {/* Placeholder for featured products */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Arrangements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border border-gray-200 rounded-lg p-4">
                <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-500">Product {item}</span>
                </div>
                <h4 className="font-semibold mb-1">Arrangement {item}</h4>
                <p className="text-sm text-gray-600 mb-2">Beautiful flower arrangement</p>
                <p className="text-lg font-bold text-green-600">${(29.99 + item * 10).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}