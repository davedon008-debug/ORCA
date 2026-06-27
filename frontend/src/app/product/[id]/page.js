"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { Star, Truck, ShieldCheck, Heart, ShoppingBag, Minus, Plus, ChevronRight, Send } from "lucide-react";
import Link from 'next/link';
import api from "../../../utils/axiosInstance";
import { CartContext } from "../../../context/CartContext";
import { AuthContext } from "../../../context/AuthContext";
import { useWishlist } from "../../../context/WishlistContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const alreadyReviewed = product?.reviews?.some(
    (r) => r.user?.toString() === user?._id?.toString()
  );

  const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!reviewRating) { setReviewError('Please select a star rating.'); return; }
    if (!reviewComment.trim()) { setReviewError('Please write a comment.'); return; }
    setReviewSubmitting(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      await api.post(
        `/api/products/${id}/reviews`,
        { rating: reviewRating, comment: reviewComment.trim() },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setReviewSuccess('Your review has been submitted! Thank you.');
      setReviewRating(0);
      setReviewComment('');
      await fetchProduct(); // refresh to show new review
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, qty });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-blue-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          
          {/* Product Images Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-square relative mb-4 shadow-sm border border-gray-100">
              <img 
                src={
                  (() => {
                    const img = product.images?.[activeImage] && product.images[activeImage] !== '/images/sample.jpg' 
                      ? product.images[activeImage] 
                      : "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80";
                    return img.startsWith('/') ? `http://localhost:5001${img}` : img;
                  })()
                } 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm transition-all ${
                  isInWishlist(product._id) ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
                }`}
                title="Add to Wishlist"
              >
                <Heart size={24} className={isInWishlist(product._id) ? 'fill-current' : ''} />
              </button>
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img 
                      src={img.startsWith('/') ? `http://localhost:5001${img}` : img} 
                      alt={`Thumb ${idx}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="font-outfit text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-blue-600 font-medium mb-4">{product.brand}</p>
            
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < Math.round(product.rating || 0) ? "fill-current" : "text-gray-300 fill-current"} />
                ))}
              </div>
              <span className="text-gray-500 ml-2 font-medium">({product.numReviews} reviews)</span>
            </div>

            <div className="text-4xl font-black text-gray-900 mb-6">
              ${product.price?.toFixed(2)}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              {product.description}
            </p>

            <div className="h-px bg-gray-200 w-full mb-8"></div>

            <div className="mb-8">
              <h4 className="font-bold text-gray-900 mb-3">Quantity</h4>
              <div className="flex items-center border border-gray-300 w-32 rounded-full overflow-hidden">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1 text-center font-bold text-lg">{qty}</div>
                <button 
                  onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                  className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  disabled={qty >= product.countInStock}
                >
                  <Plus size={16} />
                </button>
              </div>
              {product.countInStock > 0 ? (
                <p className="text-green-600 text-sm mt-2 font-medium">{product.countInStock} currently in stock</p>
              ) : (
                <p className="text-red-500 text-sm mt-2 font-medium">Out of stock</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="mr-2" size={20} /> 
                {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-gray-100">
          <div className="flex border-b border-gray-200 mb-8 space-x-8">
            <button 
              className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'description' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
              {activeTab === 'description' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-md"></div>}
            </button>
            <button 
              className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'specs' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
              {activeTab === 'specs' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-md"></div>}
            </button>
            <button 
              className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'reviews' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.numReviews})
              {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-md"></div>}
            </button>
          </div>

          <div className="min-h-[200px]">
            {activeTab === 'description' && (
              <div className="text-gray-600 leading-relaxed max-w-3xl">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Premium Quality</h4>
                      <p className="text-sm text-gray-500 mt-1">Crafted from top-tier materials for lasting durability.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
                      <Truck size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Careful Handling</h4>
                      <p className="text-sm text-gray-500 mt-1">Specialized white-glove delivery straight to your room.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="max-w-3xl">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <table className="w-full text-left">
                    <tbody>
                      {Object.keys(product.specifications).map((key) => (
                        <tr key={key} className="border-b border-gray-200">
                          <td className="py-4 font-semibold text-gray-900 w-1/3">{key}</td>
                          <td className="py-4 text-gray-600">{product.specifications[key]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No specifications provided for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">

                {/* Write a Review Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-5">Write a Review</h3>

                  {!user ? (
                    <div className="text-center py-6 bg-gray-50 rounded-xl">
                      <p className="text-gray-500 mb-3">You must be logged in to leave a review.</p>
                      <Link href="/" className="text-blue-600 font-bold hover:underline">Sign In →</Link>
                    </div>
                  ) : alreadyReviewed ? (
                    <div className="flex items-center gap-3 bg-green-50 text-green-700 border border-green-200 rounded-xl px-5 py-4">
                      <Star size={20} className="fill-current text-yellow-400" />
                      <p className="font-medium">You have already reviewed this product. Thank you!</p>
                    </div>
                  ) : (
                    <form onSubmit={submitReviewHandler} className="space-y-5">
                      {/* Star picker */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setReviewHover(star)}
                              onMouseLeave={() => setReviewHover(0)}
                              className="focus:outline-none transition-transform hover:scale-125"
                            >
                              <Star
                                size={32}
                                className={(
                                  star <= (reviewHover || reviewRating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 fill-current'
                                ) + ' transition-colors'}
                              />
                            </button>
                          ))}
                          {reviewRating > 0 && (
                            <span className="ml-3 self-center text-sm font-medium text-gray-600">
                              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Comment</label>
                        <textarea
                          rows={4}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                        />
                      </div>

                      {reviewError && (
                        <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg">{reviewError}</p>
                      )}
                      {reviewSuccess && (
                        <p className="text-green-600 text-sm font-medium bg-green-50 px-4 py-2 rounded-lg">{reviewSuccess}</p>
                      )}

                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                      >
                        <Send size={16} />
                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Existing Reviews */}
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">{product.reviews.length} Review{product.reviews.length !== 1 ? 's' : ''}</h3>
                    {product.reviews.map((review) => (
                      <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-3">
                          <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mr-3">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                            <div className="flex text-yellow-400 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={13} className={i < review.rating ? 'fill-current' : 'text-gray-300 fill-current'} />
                              ))}
                            </div>
                          </div>
                          <span className="ml-auto text-sm text-gray-400">{review.createdAt?.substring(0, 10)}</span>
                        </div>
                        <p className="text-gray-600 italic leading-relaxed">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                    <Star size={40} className="text-gray-200 fill-current mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No reviews yet. Be the first!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}