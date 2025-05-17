'use client';

import { useEffect, useState } from 'react';
import { TextInput, NumberInput, Textarea, Button, Select, Text, Group } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { Category } from '@/types/product';
import Image from 'next/image';

interface ProductFormValues {
  title: string;
  price: number;
  category: string;
  description: string;
  sellerName: string;
  sellerEmail: string;
}

export default function SellPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<FileWithPath | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    initialValues: {
      title: '',
      price: 0,
      category: '',
      description: '',
      sellerName: '',
      sellerEmail: '',
    },
    validate: {
      title: (value) => (value.trim().length < 3 ? 'Title must be at least 3 characters' : null),
      price: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
      category: (value) => (!value ? 'Please select a category' : null),
      description: (value) => (value.trim().length < 10 ? 'Description must be at least 10 characters' : null),
      sellerName: (value) => (value.trim().length < 3 ? 'Name must be at least 3 characters' : null),
      sellerEmail: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Please enter a valid email address'),
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
      }
    };

    fetchCategories();
  }, []);

  const handleImageDrop = (files: FileWithPath[]) => {
    if (files.length > 0) {
      const file = files[0];
      setUploadedImage(file);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (values: ProductFormValues) => {
    // Validate that an image was uploaded
    if (!uploadedImage) {
      setError('Please upload a product image');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create a FormData object to send the form values and image
      const formData = new FormData();
      formData.append('image', uploadedImage);
      formData.append('title', values.title);
      formData.append('price', values.price.toString());
      formData.append('category', values.category);
      formData.append('description', values.description);
      formData.append('sellerName', values.sellerName);
      formData.append('sellerEmail', values.sellerEmail);
      formData.append('status', 'submitted');

      // Send the form data to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products/upload`, {
        method: 'POST',
        body: formData,
        // No Content-Type header needed as it will be set automatically with boundary for FormData
      });

      if (!response.ok) {
        throw new Error('Failed to submit product');
      }

      setIsSuccess(true);
      form.reset();
      setUploadedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting product:', error);
      setError('Failed to submit product. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up URL.createObjectURL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (isSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Product Submitted Successfully!
          </h2>
          <p className="mb-6 text-gray-600">
            Your product has been submitted for review. Our team will verify your listing soon.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              color="green"
              onClick={() => setIsSuccess(false)}
            >
              Submit Another Product
            </Button>
            <Button
              variant="outline"
              component="a"
              href="/"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sell Your Luxury Item</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
        <TextInput
          label="Product Title"
          labelProps={{ className: "text-gray-600" }}
          placeholder="e.g. Vintage Gucci Shirt"
          required
          {...form.getInputProps('title')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput
            label="Price (USD)"
            labelProps={{ className: "text-gray-600" }}
            placeholder="0.00"
            decimalScale={2}
            min={0}
            required
            {...form.getInputProps('price')}
          />

          <Select
            label="Category"
            labelProps={{ className: "text-gray-600" }}
            placeholder="Select a category"
            data={categories.map(cat => ({ value: cat.name, label: cat.name }))}
            required
            {...form.getInputProps('category')}
            styles={{
              option: { color: '#374151' } // Use option instead of item
            }}
            classNames={{
              dropdown: "text-gray-700",
              option: "text-gray-700 hover:text-gray-900" // Use option instead of item
            }}
          />
        </div>

        <Textarea
          label="Description"
          labelProps={{ className: "text-gray-600" }}
          placeholder="Describe your item in detail (condition, size, authenticity, etc.)"
          minRows={4}
          required
          {...form.getInputProps('description')}
        />

        <div>
          <Text size="sm" fw={500} className="text-gray-600 mb-6">Product Image</Text>
          
          <Dropzone
            onDrop={handleImageDrop}
            maxSize={5 * 1024 * 1024} // 5MB max size
            accept={{
              'image/*': ['.png', '.jpeg', '.jpg', '.webp']
            }}
            className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center"
          >
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="mt-4">
                <Text size="sm" className="font-medium text-gray-600">
                  Drop your image here, or click to select
                </Text>
                <Text size="xs" className="mt-1 text-gray-500">
                  PNG, JPG or WEBP up to 5MB
                </Text>
              </div>
            </div>
          </Dropzone>

          {imagePreview && (
            <div className="mt-4">
              <Text size="sm" fw={500} className="text-gray-600 mb-2">Preview</Text>
              <div className="relative h-48 w-full">
                <Image 
                  src={imagePreview} 
                  alt="Product preview"
                  className="rounded-md object-contain"
                  fill
                />
              </div>
              <Button
                variant="subtle"
                color="red"
                size="xs"
                className="mt-2"
                onClick={() => {
                  setUploadedImage(null);
                  setImagePreview(null);
                }}
              >
                Remove image
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Your Name"
            labelProps={{ className: "text-gray-600" }}
            placeholder="Full Name"
            required
            {...form.getInputProps('sellerName')}
          />

          <TextInput
            label="Email Address"
            labelProps={{ className: "text-gray-600" }}
            placeholder="you@example.com"
            type="email"
            required
            {...form.getInputProps('sellerEmail')}
          />
        </div>

        <div className="pt-4">
          <Text size="sm" className="text-gray-600 mb-4">
            By submitting this form, you agree to our Terms of Service and Privacy Policy.
            Your product will be reviewed by our team before being listed on the marketplace.
          </Text>
          
          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
            size="lg"
            className="bg-pink-600 hover:bg-pink-700"
          >
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  );
} 