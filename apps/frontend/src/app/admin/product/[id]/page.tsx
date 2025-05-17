'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types/product';
import {
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Select,
  Paper,
  Text,
  Grid,
  Badge,
  Image,
  LoadingOverlay,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface ProductFormValues {
  title: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  status: string;
}

interface AdminProductPageProps {
  params: {
    id: string;
  };
}

export default function AdminProductPage(props: AdminProductPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For client components in Next.js, we need to access the ID directly
  // We'll extract it in useEffect where it's safe to do so
  const [productId, setProductId] = useState<string>('');
  
  // Extract the ID once when component mounts
  useEffect(() => {
    if (props.params && props.params.id) {
      setProductId(props.params.id);
    }
  }, [props.params]);

  const form = useForm<ProductFormValues>({
    initialValues: {
      title: '',
      price: 0,
      category: '',
      description: '',
      imageUrl: '',
      status: '',
    },
    validate: {
      title: (value) => (value.trim().length < 3 ? 'Title must be at least 3 characters' : null),
      price: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
      category: (value) => (!value ? 'Please select a category' : null),
      description: (value) => (value.trim().length < 10 ? 'Description must be at least 10 characters' : null),
      imageUrl: (value) => {
        if (!value.trim()) return 'Image URL is required';
        try {
          new URL(value);
          return null;
        } catch (error) {
          return 'Please enter a valid URL';
        }
      },
      status: (value) => (!value ? 'Please select a status' : null),
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'blue';
      case 'under review':
        return 'yellow';
      case 'validated':
        return 'green';
      case 'rejected':
        return 'red';
      case 'sold':
        return 'grape';
      default:
        return 'gray';
    }
  };

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products/${productId}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/categories`),
        ]);

        if (!productRes.ok) {
          throw new Error('Failed to fetch product');
        }

        if (!categoriesRes.ok) {
          throw new Error('Failed to fetch categories');
        }

        const productData = await productRes.json();
        const categoriesData = await categoriesRes.json();

        setProduct(productData);
        setCategories(categoriesData);

        form.setValues({
          title: productData.title,
          price: productData.price,
          category: productData.category,
          description: productData.description,
          imageUrl: productData.imageUrl,
          status: productData.status,
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndCategories();
  }, [productId]);

  const handleSubmit = async (values: ProductFormValues) => {
    if (!productId) {
      setError('Product ID not available');
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      setProduct(updatedProduct);

      notifications.show({
        title: 'Success',
        message: 'Product updated successfully',
        color: 'green',
      });
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] relative">
        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm">
        <Text size="lg" fw={500} className="mb-2">
          Product not found
        </Text>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/admin')}
        >
          Back to Admin Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <Text size="sm" color="dimmed" className=" text-gray-600 mt-1">
            ID: {product.id} | Created: {new Date(product.createdAt).toLocaleString()}
          </Text>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/admin')}
          className="text-xs sm:text-sm md:text-base px-2 sm:px-4 h-8 sm:h-10 border-pink-200 text-pink-600 hover:bg-pink-50 transition-colors duration-300 flex items-center gap-1 sm:gap-2"
          size="compact-sm"
        >
         
          <span className="whitespace-nowrap">Back to Dashboard</span>
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Paper className="p-6">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <div className="space-y-4">
                <TextInput
                  label="Product Title"
                  labelProps={{ className: "text-gray-600" }}
                  placeholder="Product title"
                  required
                  {...form.getInputProps('title')}
                />

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <NumberInput
                      label="Price (USD)"
                      labelProps={{ className: "text-gray-600" }}
                      placeholder="0.00"
                      decimalScale={2}
                      min={0}
                      required
                      {...form.getInputProps('price')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
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
                  </Grid.Col>
                </Grid>

                <TextInput
                  label="Image URL"
                  labelProps={{ className: "text-gray-600" }}
                  placeholder="https://example.com/image.jpg"
                  required
                  {...form.getInputProps('imageUrl')}
                />

                <Textarea
                  label="Description"
                  labelProps={{ className: "text-gray-600" }}
                  placeholder="Product description"
                  minRows={4}
                  required
                  {...form.getInputProps('description')}
                />

                <Select
                  label="Status"
                  labelProps={{ className: "text-gray-600" }}
                  placeholder="Select status"
                  data={[
                    { value: 'submitted', label: 'Submitted' },
                    { value: 'under review', label: 'Under Review' },
                    { value: 'validated', label: 'Validated' },
                    { value: 'rejected', label: 'Rejected' },
                    { value: 'sold', label: 'Sold' },
                  ]}
                  required
                  {...form.getInputProps('status')}
                  styles={{
                    option: { color: '#374151' } // Use option instead of item
                  }}
                  classNames={{
                    dropdown: "text-gray-700",
                    option: "text-gray-700 hover:text-gray-900" // Use option instead of item
                  }}
                />

                <Group justify="flex-end" mt={30}>
                  <Button
                    type="submit"
                    loading={submitting}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    Update Product
                  </Button>
                </Group>
              </div>
            </form>
          </Paper>
        </div>

        <div>
          <Paper className="p-6">
            <Text size="lg" fw={500} className="text-gray-600 mb-4">
              Product Preview
            </Text>
            <div className="mb-4 relative h-[200px] w-full">
              <Image
                src={form.values.imageUrl}
                alt={form.values.title}
                className="max-w-full h-auto rounded border border-gray-200"
              />
            </div>
            <div className="mb-4">
              <Badge color={getStatusColor(form.values.status)} size="lg" className="mb-2">
                {form.values.status}
              </Badge>
              <Text size="lg" className="text-pink-600" fw={700}>
                {form.values.title}
              </Text>
              <Text size="xl" fw={700} className="text-pink-600">
                ${Number(form.values.price).toFixed(2)}
              </Text>
            </div>
            <div className="mb-4">
              <Text size="sm" fw={500} className="text-gray-600 mb-1">
                Seller Information
              </Text>
              <Text size="sm" className="text-gray-600">
                {product.sellerName} ({product.sellerEmail})
              </Text>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
} 