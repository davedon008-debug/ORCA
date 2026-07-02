const products = [
  // Living Room
  {
    name: 'Modern Velvet Sofa', price: 899.99, rating: 4.8, numReviews: 124, countInStock: 5,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80'],
    brand: 'Orca Home', description: 'Elegant modern velvet sofa with pristine cushioning and durable wooden frame.'
  },
  {
    name: 'Minimalist Coffee Table', price: 299.99, rating: 4.5, numReviews: 89, countInStock: 12,
    images: ['https://images.unsplash.com/photo-1532372576444-baa8ba6a31c5?w=500&q=80'],
    brand: 'Orca Home', description: 'Sleek metal and glass coffee table.'
  },
  {
    name: 'L-Shaped Sectional Couch', price: 1299.99, rating: 4.7, numReviews: 210, countInStock: 3,
    images: ['https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500&q=80'],
    brand: 'Orca Home', description: 'Large cozy L-shaped sectional couch for spacious living areas.'
  },
  {
    name: 'Knitted Accent Chair', price: 249.99, rating: 4.6, numReviews: 44, countInStock: 8,
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80'],
    brand: 'Orca Home', description: 'A comfortable accent chair perfectly suited for reading.'
  },
  {
    name: 'Industrial Wooden TV Stand', price: 349.99, rating: 4.9, numReviews: 156, countInStock: 2,
    images: ['https://images.unsplash.com/photo-1595514535215-814080ebedab?w=500&q=80'],
    brand: 'Orca Home', description: 'Solid wood TV stand with rustic metal accents.'
  },

  // Kitchen Appliances
  {
    name: 'Smart Refrigerator Pro X', price: 1899.99, rating: 4.9, numReviews: 342, countInStock: 10,
    images: ['https://images.unsplash.com/photo-1588854337115-1c67d9247e0d?w=500&q=80'],
    brand: 'Electra', description: 'Next generation smart refrigerator with built-in touchscreen.'
  },
  {
    name: 'Whisper-Quiet Dishwasher', price: 749.99, rating: 4.6, numReviews: 104, countInStock: 8,
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80'],
    brand: 'Electra', description: 'High-capacity, energy-efficient dishwasher.'
  },
  {
    name: 'Stainless Steel Microwave', price: 199.99, rating: 4.5, numReviews: 88, countInStock: 25,
    images: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&q=80'],
    brand: 'Electra', description: 'Premium 1000W stainless steel microwave with preset cooking modes.'
  },
  {
    name: 'Precision Espresso Machine', price: 599.99, rating: 4.8, numReviews: 420, countInStock: 5,
    images: ['https://images.unsplash.com/photo-1517093602195-b40af9688b46?w=500&q=80'],
    brand: 'Orca Coffee', description: 'Barista-level espresso machine with integrated grinder.'
  },
  {
    name: 'Professional Gas Range', price: 1299.99, rating: 4.7, numReviews: 67, countInStock: 4,
    images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80'],
    brand: 'Electra', description: '6-burner professional gas range with convection oven.'
  },

  // Bedroom
  {
    name: 'King Size Memory Foam Mattress', price: 899.99, rating: 4.9, numReviews: 530, countInStock: 15,
    images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80'],
    brand: 'Orca Sleep', description: 'Ultra comfort cooling gel memory foam mattress.'
  },
  {
    name: 'Mid-Century Modern Bed Frame', price: 449.99, rating: 4.6, numReviews: 215, countInStock: 6,
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80'],
    brand: 'Orca Sleep', description: 'Solid walnut wood bed frame with upholstered headboard.'
  },
  {
    name: 'Wooden Nightstand Set', price: 199.99, rating: 4.4, numReviews: 112, countInStock: 20,
    images: ['https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500&q=80'],
    brand: 'Orca Sleep', description: 'Set of two matching mid-century nightstands.'
  },
  {
    name: 'Minimalist Wardrobe Closet', price: 699.99, rating: 4.2, numReviews: 45, countInStock: 2,
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=500&q=80'],
    brand: 'Orca Sleep', description: 'Spacious sliding door wardrobe with integrated LED lighting.'
  },
  {
    name: 'Luxury Cotton Bedding Set', price: 149.99, rating: 4.8, numReviews: 320, countInStock: 50,
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80'],
    brand: 'Orca Sleep', description: '100% Egyptian cotton high-thread-count bedding set.'
  },

  // Office
  {
    name: 'Ergonomic Executive Chair', price: 249.99, rating: 4.7, numReviews: 210, countInStock: 30,
    images: ['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80'],
    brand: 'Orca Work', description: 'Fully adjustable ergonomic chair designed for extreme 8+ hours productivity.'
  },
  {
    name: 'Motorized Standing Desk', price: 499.99, rating: 4.8, numReviews: 189, countInStock: 12,
    images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&q=80'],
    brand: 'Orca Work', description: 'Dual-motor adjustable height standing desk with premium bamboo top.'
  },
  {
    name: 'Curved Ultra-Wide Monitor', price: 799.99, rating: 4.9, numReviews: 412, countInStock: 5,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'],
    brand: 'ViewMaster', description: '34-inch curved ultra-wide QHD monitor for maximum productivity.'
  },
  {
    name: 'Minimalist Filing Cabinet', price: 129.99, rating: 4.3, numReviews: 65, countInStock: 18,
    images: ['https://images.unsplash.com/photo-1567225477277-c8162eb4991d?w=500&q=80'],
    brand: 'Orca Work', description: 'Clean white metal 3-drawer filing cabinet with lock.'
  },
  {
    name: 'LED Desk Lamp with Charging', price: 59.99, rating: 4.6, numReviews: 288, countInStock: 40,
    images: ['https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&q=80'],
    brand: 'Orca Light', description: 'Adjustable LED desk lamp featuring wireless phone charging base.'
  }
];

export default products;
