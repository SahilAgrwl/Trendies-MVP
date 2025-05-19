import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing products to prevent duplicates
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  console.log('Deleted existing products');

  // Seed categories
  const categories = [
    { name: 'Shirts' },
    { name: 'Pants' },
    { name: 'Dresses' },
    { name: 'Accessories' },
    { name: 'Shoes' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Seed admin users
  const adminUsers = [
    { email: 'sahilagrawal4556@gmail.com', password: 'trendies296' },
    { email: 'hellocodesahil@gmail.com', password: 'trendies296' },
    { email: 'smail.bensaad@trendiesmaroc.com', password: 'trendies296' },
  ];

  for (const admin of adminUsers) {
    await (prisma as any).admin.upsert({
      where: { email: admin.email },
      update: { password: admin.password },
      create: admin,
    });
  }

  // Seed products
  const products = [
    {
      title: 'Vintage Gucci Shirt',
      price: 259.99,
      category: 'Shirts',
      description: 'Authentic vintage Gucci shirt in excellent condition. Size M.',
      imageUrl: 'https://images.unsplash.com/photo-1594201638839-e36ddd34822d?q=80&w=500',
      sellerName: 'Jane Smith',
      sellerEmail: 'jane@example.com',
      status: 'validated',
    },
    {
      title: 'Louis Vuitton Handbag',
      price: 899.99,
      category: 'Accessories',
      description: 'Authentic Louis Vuitton handbag, lightly used. Includes dust bag.',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500',
      sellerName: 'Michael Brown',
      sellerEmail: 'michael@example.com',
      status: 'validated',
    },
    {
      title: 'Prada Leather Boots',
      price: 449.99,
      category: 'Shoes',
      description: 'Prada leather boots, size 39. Only worn a few times.',
      imageUrl: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?q=80&w=500',
      sellerName: 'Emily Jones',
      sellerEmail: 'emily@example.com',
      status: 'submitted',
    },
    {
      title: 'Burberry Trench Coat',
      price: 599.99,
      category: 'Accessories',
      description: 'Classic Burberry trench coat, size S. Perfect condition.',
      imageUrl: 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=500',
      sellerName: 'David Wilson',
      sellerEmail: 'david@example.com',
      status: 'under review',
    },
    {
      title: 'Chanel Dress',
      price: 789.99,
      category: 'Dresses',
      description: 'Vintage Chanel dress, size 36. Excellent condition.',
      imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=500',
      sellerName: 'Olivia Green',
      sellerEmail: 'olivia@example.com',
      status: 'validated',
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 