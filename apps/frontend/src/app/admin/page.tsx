'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { Paper, Tabs, Badge, Pagination, Select, Text, Button } from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

type ProductStatus = 'submitted' | 'under review' | 'validated' | 'rejected' | 'sold' | undefined;

export default function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  
  const currentPage = Number(searchParams.get('page') || '1');
  const statusFilter = searchParams.get('status') as ProductStatus || undefined;
  
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', currentPage.toString());
      
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/products?${queryParams.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, statusFilter]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/admin?${params.toString()}`);
  };

  const handleStatusChange = (status: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    
    router.push(`/admin?${params.toString()}`);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      
      <Paper className="mb-6 p-4">
        <div className="flex flex-col text-gray-700 md:flex-row justify-between md:items-center gap-4">
          <div>
            <Text size="sm" fw={500} className="text-gray-700 mb-2">Filter by Status</Text>
            
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              placeholder="All Statuses"
              clearable
              data={[
                { value: 'submitted', label: 'Submitted' },
                { value: 'under review', label: 'Under Review' },
                { value: 'validated', label: 'Validated' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'sold', label: 'Sold' },
              ]}
              className=" w-full md:w-60"
              styles={{
                option: { color: '#374151' } // Use option instead of item
              }}
              classNames={{
                dropdown: "text-gray-700",
                option: "text-gray-700 hover:text-gray-900" // Use option instead of item
              }}
              
            />
           
          </div>
          
          <Text size="sm" color="dimmed">
            Showing {products.length} of {total} products
          </Text>
        </div>
      </Paper>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <Text size="lg" fw={500} className="mb-2">
            No products found
          </Text>
          <Text size="sm" color="dimmed">
            {statusFilter 
              ? `There are no products with the status "${statusFilter}".` 
              : 'There are no products in the database.'}
          </Text>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/admin/product/${product.id}`}
              className="block"
            >
              <Paper className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-32 h-32 relative">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">{product.title}</h2>
                        <p className="text-sm text-gray-500">
                          Seller: {product.sellerName} ({product.sellerEmail})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-700">${product.price.toFixed(2)}</p>
                        <Badge color={getStatusColor(product.status)}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <Text size="xs" className="text-gray-700" color="dimmed">
                        ID: {product.id} | Category: {product.category}
                      </Text>
                      <Text size="xs" className="text-gray-700" color="dimmed">
                        Created: {new Date(product.createdAt).toLocaleString()}
                      </Text>
                    </div>
                  </div>
                </div>
              </Paper>
            </Link>
          ))}
        </div>
      )}
      
      {pages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            value={currentPage}
            onChange={handlePageChange}
            total={pages}
          />
        </div>
      )}
    </div>
  );
} 