import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const NostalgicCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    {
      image: '/images/carousel1.jpg',
      caption: "Grandma's recipe, reimagined",
      description: "Traditional flavors with a modern vegan twist"
    },
    {
      image: '/images/carousel2.jpg',
      caption: "Crafted by world-class chefs",
      description: "Michelin-star quality delivered to your door"
    },
    {
      image: '/images/carousel3.jpg',
      caption: "Beautifully packaged",
      description: "Ready to gift or enjoy yourself"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto my-12 overflow-hidden rounded-xl shadow-lg">
      <div className="relative h-96 md:h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={slide.image}
              alt={slide.caption}
              className="w-full h-full object-cover filter sepia-20 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute bottom-20 left-10 max-w-md bg-white/90 p-6 border-l-4 border-amber-400">
              <h3 className="text-2xl md:text-3xl font-serif italic text-gray-800">{slide.caption}</h3>
              <p className="mt-2 text-gray-600">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-amber-100 transition-colors"
      >
        <FiChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-amber-100 transition-colors"
      >
        <FiChevronRight className="w-6 h-6 text-gray-800" />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-amber-400' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NostalgicCarousel;