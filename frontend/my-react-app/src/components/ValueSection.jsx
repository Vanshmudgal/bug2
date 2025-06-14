const ValuesSection = () => {
    const values = [
      {
        icon: '🍃',
        title: "Plant-Based Goodness",
        description: "100% vegan ingredients that don't compromise on taste or texture"
      },
      {
        icon: '👩‍🍳',
        title: "Chef-Crafted",
        description: "Created by award-winning pastry chefs with a passion for innovation"
      },
      {
        icon: '📦',
        title: "Direct to You",
        description: "Freshly made and shipped in sustainable packaging"
      },
      {
        icon: '❤️',
        title: "Nostalgic Flavors",
        description: "Classic desserts reimagined with modern techniques"
      }
    ];
  
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Values</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              We combine tradition with innovation to create vegan desserts that evoke cherished memories while being kind to the planet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-amber-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default ValuesSection;