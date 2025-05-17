'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { Button, TextInput, Radio, Group, Text, rem } from '@mantine/core';
import { useRouter } from 'next/navigation';

interface CheckoutProps {
  product: Product;
}

export default function Checkout({ product }: CheckoutProps) {
  const router = useRouter();
  const [step, setStep] = useState<'initial' | 'checkout' | 'confirmed' | 'error'>('initial');
  const [buyerName, setBuyerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'TPE' | 'Cash'>('TPE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddToCart = () => {
    setStep('checkout');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buyerName.trim()) {
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
          productId: product.id,
          buyerName,
          paymentMethod,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      
      setStep('confirmed');
      // Refresh data
      router.refresh();
    } catch (error) {
      console.error('Error placing order:', error);
      setStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'confirmed') {
    return (
      <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-8 mt-6 shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center ring-8 ring-green-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <Text size="xl" fw={700} className="text-green-700 mb-2 text-center">
          Order confirmed!
        </Text>
        <Text className="text-green-600 mb-6 text-center">
          Thank you for your purchase. Your order has been placed successfully.
        </Text>
        <div className="flex justify-center">
          <Button
            color="green"
            onClick={() => router.push('/')}
            className="bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            size="md"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-8 mt-6 shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center ring-8 ring-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <Text size="xl" fw={700} className="text-red-700 mb-2 text-center">
          Something went wrong
        </Text>
        <Text className="text-red-600 mb-6 text-center">
          There was an error processing your order. Please try again later.
        </Text>
        <div className="flex justify-center">
          <Button
            color="red"
            onClick={() => setStep('initial')}
            className="bg-red-600 hover:bg-red-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            size="md"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-pink-100 transform transition-all duration-300">
          <div className="border-b border-pink-100 pb-6">
            <Text size="xl" fw={700} className="text-gray-800 mb-1">Complete Your Purchase</Text>
            <Text size="sm" className="text-gray-500">Please enter your details to continue</Text>
          </div>
          
          <div className="space-y-4">
            <TextInput
              label="Your Name"
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
                        <span>Credit Card (TPE)</span>
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
                        <span>Cash on Delivery</span>
                      </div>
                    }
                    classNames={{
                      radio: "checked:border-pink-500 checked:bg-pink-500",
                    }}
                  />
                </Group>
              </Radio.Group>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('initial')}
                className="border-pink-300 text-pink-600 hover:bg-pink-50 transition-colors duration-300"
                size="md"
              >
                Back
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-px"
                size="md"
              >
                Confirm Order
              </Button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <Button
      size="lg"
      fullWidth
      className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-px transition-all duration-300"
      onClick={handleAddToCart}
    >
      Add to Cart
    </Button>
  );
} 