import { Link } from 'react-router-dom';
import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#FFF9F0] font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1602351447937-745cb720612f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
            Our <span className="text-[#F9D71C]">Sweet</span> Story
          </h1>
          <p className="text-xl text-white mb-8">
            From humble beginnings to creating revolutionary vegan desserts
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl text-[#8B5A2B] mb-4">
            How It All Began
          </h2>
          <div className="w-20 h-1 bg-[#F9D71C] mx-auto"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Founder making desserts" 
              className="rounded-lg shadow-xl w-full"
            />
          </div>
          <div className="md:w-1/2">
            <p className="text-[#5A3E1E] mb-6 text-lg">
              It all started in a tiny home kitchen in 2015, when our founder Sarah couldn't find truly delicious vegan versions of her childhood favorite desserts. What began as weekend experiments soon turned into a mission to revolutionize plant-based sweets.
            </p>
            <p className="text-[#5A3E1E] mb-6 text-lg">
              We believe indulgence shouldn't come at the cost of animal welfare or the environment. Every recipe is crafted with this philosophy, using only the finest plant-based ingredients to recreate nostalgic flavors.
            </p>
          
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[#F9D71C] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl text-[#8B5A2B] mb-4">
              Our Core Values
            </h2>
            <div className="w-20 h-1 bg-[#8B5A2B] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: "🌱", 
                title: "Plant-Powered", 
                desc: "100% vegan ingredients, always. No exceptions." 
              },
              { 
                icon: "✨", 
                title: "Chef-Crafted", 
                desc: "Professional techniques for exceptional quality." 
              },
              { 
                icon: "🌎", 
                title: "Sustainable", 
                desc: "Ethical sourcing and eco-friendly packaging." 
              },
              { 
                icon: "❤️", 
                title: "Inclusive", 
                desc: "Desserts for all diets and restrictions." 
              },
              { 
                icon: "👩‍🍳", 
                title: "Innovative", 
                desc: "Constant recipe development and improvement." 
              },
              { 
                icon: "🏆", 
                title: "Quality", 
                desc: "We never compromise on taste or ingredients." 
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-serif text-xl text-[#8B5A2B] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-[#8B5A2B] mb-6">
            Passionate People Behind the Pastries
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team of pastry chefs, bakers, and dessert enthusiasts work tirelessly to bring you innovative vegan creations that surprise and delight.
          </p>
          <Link 
            to="/team" 
            className="inline-block bg-[#F9D71C] hover:bg-[#E8C220] text-[#8B5A2B] font-medium py-3 px-8 rounded-full transition-colors shadow-sm"
          >
            Meet The Team
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}