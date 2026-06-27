"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Filter, ArrowLeft } from 'lucide-react';
import api from '../../../utils/axiosInstance';

export default function CategoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const slug = params.slug; // e.g., 'living-room', 'kitchen', 'office'
  
  // Convert slug back to title case category (e.g., 'living-room' -> 'Living Room')
  const formattedCategory = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const { data } = await api.get(`/api/products?category=${encodeURIComponent(formattedCategory)}&pageSize=50`);
        setProducts(data.products || []);
      } catch (e) {
        console.error('Failed to fetch category products', e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [formattedCategory]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-blue-600">Loading Category...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Home
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{formattedCategory} Collection</h1>
        <button className="flex items-center text-gray-600 hover:text-blue-600 border border-gray-300 rounded-md px-4 py-2 bg-white transition-colors">
          <Filter size={18} className="mr-2" /> Filters
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link href={`/product/${product._id}`} key={product._id}>
              <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  <img 
                    src={product.images && product.images[0] ? (product.images[0].startsWith('/') ? `http://localhost:5001${product.images[0]}` : product.images[0]) : "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80"} 
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">{product.name}</h3>
                  <div className="flex items-center mb-3">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-sm text-gray-600 ml-1">{product.rating} ({product.numReviews})</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-xl text-gray-900">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
