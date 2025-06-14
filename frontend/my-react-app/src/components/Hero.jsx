import React from "react";


const Header = () => {
    return (
      <section className="relative bg-amber-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/vintage-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-gray-800">
              Vegan Desserts with a <span className="text-amber-600">Nostalgic</span> Twist
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700">
              Handcrafted by world-class chefs, delivered to your doorstep. Experience the flavors of your childhood, reimagined for today.
            </p>
            <div className="flex space-x-4">
              <button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors shadow-md">
                Shop Now
              </button>
              <button className="border-2 border-gray-800 hover:bg-gray-800 hover:text-white text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors">
                Our Story
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Header;