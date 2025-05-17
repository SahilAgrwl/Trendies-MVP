'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Button, TextInput, Radio, Group, Text, Paper, LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CheckoutPageProps {
  params: {
    id: string;
  };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const router = useRouter();
  const [productId, setProductId] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'loading' | 'checkout' | 'confirmed' | 'error'>('loading');
  const [buyerName, setBuyerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'TPE' | 'Cash'>('TPE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract ID from params
  useEffect(() => {
    if (params && params.id) {
      setProductId(params.id);
    }
  }, [params]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products/${productId}`,
          { cache: 'no-store' }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        
        // Check if product is available
        if (data.status !== 'validated') {
          throw new Error('This product is not available for purchase');
        }
        
        setProduct(data);
        setStep('checkout');
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        setStep('error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buyerName.trim() || !product) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: Number(productId),
          buyerName,
          paymentMethod,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      
      setStep('confirmed');
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
      setStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] relative backdrop-blur-sm bg-white/30 rounded-xl">
        <LoadingOverlay 
          visible={true} 
          zIndex={1000} 
          overlayProps={{ 
            radius: "md", 
            blur: 3,
            backgroundOpacity: 0.6,
            color: "#f43f5e" 
          }} 
          loaderProps={{ 
            color: "pink", 
            size: "xl", 
            type: "bars" 
          }}
        />
      </div>
    );
  }

  if (step === 'error') {
    return (
      <Paper className="p-8 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center ring-8 ring-red-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <Text size="xl" fw={700} className="text-red-600 mb-4">
            Error
          </Text>
          <Text className="mb-6 text-red-700">
            {error || 'Something went wrong. Please try again later.'}
          </Text>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300 hover:shadow"
            size="md"
          >
            Return to Catalog
          </Button>
        </div>
      </Paper>
    );
  }

  if (step === 'confirmed') {
    return (
      <Paper className="p-8 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center ring-8 ring-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <Text size="xl" fw={700} className="text-green-600 mb-4">
            Order Confirmed!
          </Text>
          <Text className="mb-6 text-green-700">
            Thank you for your purchase. Your order has been placed successfully.
          </Text>
          <Button
            color="green"
            onClick={() => router.push('/')}
            className="bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            size="md"
          >
            Continue Shopping
          </Button>
        </div>
      </Paper>
    );
  }

  if (!product) {
    return (
      <Paper className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center ring-8 ring-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <Text size="xl" fw={700} className="text-gray-700 mb-4">
            Product Not Found
          </Text>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            size="md"
          >
            Return to Catalog
          </Button>
        </div>
      </Paper>
    );
  }

  return (
    <Paper className="p-0 bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl border border-pink-100">
      <div className="relative mb-0">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-pink-500 to-rose-600 opacity-90"></div>
        <div className="relative z-10 pt-6 px-8 pb-0">
          <Text size="xl" fw={700} className="text-white mb-2">Complete Your Purchase</Text>
          <Text size="sm" className="text-pink-100">One step away from your new luxury item</Text>
        </div>
      </div>
      
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="order-2 md:order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <TextInput
                  label={<Text fw={500} className="text-gray-700">Your Name</Text>}
                  placeholder="Enter your full name"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  classNames={{
                    root: "transition-all duration-200",
                    input: "border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50 rounded-lg"
                  }}
                  size="md"
                />
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <Radio.Group
                    label={<Text fw={500} className="text-gray-700 mb-2">Payment Method</Text>}
                    value={paymentMethod}
                    onChange={(value) => setPaymentMethod(value as 'TPE' | 'Cash')}
                    required
                  >
                    <Group mt="xs" gap="md">
                      <Radio 
                        value="TPE" 
                        label={
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-1 rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                            <span className="text-gray-600">Credit Card (TPE)</span>
                          </div>
                        }
                        classNames={{
                          radio: "checked:border-pink-500 checked:bg-pink-500",
                        }}
                      />
                      <Radio 
                        value="Cash" 
                        label={
                          <div className="flex items-center gap-2">
                            <div className="bg-green-100 p-1 rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-gray-600">Cash on Delivery</span>
                          </div>
                        }
                        classNames={{
                          radio: "checked:border-pink-500 checked:bg-pink-500",
                        }}
                      />
                    </Group>
                  </Radio.Group>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/product/${productId}`)}
                    className="border-pink-300 text-pink-600 hover:bg-pink-50 transition-colors duration-300"
                    size="md"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-px flex-1"
                    size="md"
                  >
                    Confirm Order
                  </Button>
                </div>
              </div>
            </form>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-full">
              <Text size="lg" fw={600} className="mb-4 text-gray-800">Order Summary</Text>
              
              <div className="relative h-56 w-full mb-4 overflow-hidden rounded-lg shadow-sm">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover transform transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              <div className="space-y-3">
                <Text size="lg" fw={600} className="text-gray-900">{product.title}</Text>
                <div className="flex justify-between items-center">
                  <Text size="sm" className="text-gray-600">Price:</Text>
                  <Text size="xl" fw={700} className="text-pink-600">${product.price.toFixed(2)}</Text>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Category:</span>
                  <span className="px-2 py-1 bg-gray-200 rounded-full text-gray-700">{product.category}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <div className="flex justify-between items-center">
                    <Text fw={600} className="text-gray-900">Total:</Text>
                    <Text size="xl" fw={700} className="text-pink-600">${product.price.toFixed(2)}</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
} 