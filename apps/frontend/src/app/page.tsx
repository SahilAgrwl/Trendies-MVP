import { Product } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';

async function getProducts() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products?status=validated`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data = await response.json();
  return data.products;
}

function ProductsGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No products available</h2>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          We're currently curating our collection. Check back soon for new arrivals from top designer brands!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Link 
          href={`/product/${product.id}`} 
          key={product.id}
          className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
        >
          <div className="relative h-72 w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-pink-600 text-white text-sm font-medium rounded-full shadow-md">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="p-5 flex-grow flex flex-col">
            <div className="mb-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {product.category}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-pink-600 transition-colors duration-200 mb-2">
              {product.title}
            </h3>
            
            <p className="mt-auto text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-gray-500">Verified</span>
              </div>
              
              <span className="text-sm font-medium text-pink-600 group-hover:underline">
                View Details
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      <div className="mb-12 text-center">
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-12 px-4 rounded-2xl mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-3">Luxury Products</h1>
          <p className="text-lg text-pink-100 max-w-2xl mx-auto">
            Discover authenticated luxury fashion from top designers, carefully verified for authenticity and quality
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center bg-white py-3 px-5 rounded-full shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Authenticated</span>
          </div>
          
          <div className="flex items-center bg-white py-3 px-5 rounded-full shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Fair Pricing</span>
          </div>
          
          <div className="flex items-center bg-white py-3 px-5 rounded-full shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Fast Delivery</span>
          </div>
        </div>
      </div>
      
      <ProductsGrid products={products} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading luxury products...</p>
        </div>
      </div>
    }>
      <ProductsPage />
    </Suspense>
  );
}
