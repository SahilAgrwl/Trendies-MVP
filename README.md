# Trendies - Luxury Resale Marketplace

A luxury resale marketplace built to restore trust and quality in secondhand fashion.

## Features

- **Seller Product Submission**: Submit luxury items for resale with validation
- **Admin Product Management**: Review and manage product listings
- **Buyer Catalog & Checkout**: Browse validated products and make purchases

## Project Structure

This is a monorepo using pnpm workspace with:

- **Frontend**: Next.js 15 App Router with React 19, TailwindCSS, and Mantine UI
- **Backend**: NestJS with Prisma ORM and SQLite database

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- pnpm package manager (`npm install -g pnpm`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   - Create `.env` files in both `/apps/frontend` and `/apps/backend` directories
   - Frontend :
     ```
     NEXT_PUBLIC_API_URL=http://localhost:3001
     ```
   - Backend :
     ```
     DATABASE_URL="file:./dev.db"
     JWT_SECRET="your-secret-key"
     ```

### Database Setup

```bash
cd apps/backend
pnpm run prisma:generate
pnpm run prisma:migrate:dev
pnpm run prisma:seed
```

### Running the Application

```bash
# Start both frontend and backend
pnpm run dev

# Start frontend only
pnpm run dev:frontend

# Start backend only
pnpm run dev:backend
```

The frontend will be available at http://localhost:3000 and the backend API at http://localhost:3001.

## Key Logic Explained

### Product Lifecycle

1. **Submitted**: Product is submitted by a seller
2. **Under Review**: Admin is reviewing the product details
3. **Validated**: Product is approved and visible in the marketplace
4. **Rejected**: Product is rejected by the admin
5. **Sold**: Product has been purchased by a buyer

### Image Upload Flow

1. Sellers upload product images which are stored securely
2. Images are validated for proper format and size
3. Image URLs are stored with the product data for display

### Authentication

The application uses JWT-based authentication with role-based access:
- **Sellers**: Can submit products and view their submissions
- **Admins**: Can review, validate, and manage all products
- **Buyers**: Can browse validated products and make purchases

### Admin Product Review

Admins can:
- View all submitted products in a dashboard
- Edit product details and update statuses
- Validate or reject products with comments

## Future Improvements

With more time, the application could be enhanced with:

1. **Real Payment Integration**: Connect with Stripe or PayPal for actual transactions
2. **Enhanced Authentication**: Social login and MFA options
3. **Advanced Search**: Filtering by brand, size, condition, etc.
4. **Image Processing**: Automatic background removal, watermarking, etc.
5. **Mobile App**: Native mobile applications for iOS and Android
6. **AI Product Validation**: ML models to detect counterfeits and verify authenticity
7. **Analytics Dashboard**: Sales trends, user behavior, and marketplace metrics
8. **Internationalization**: Multi-currency support and language translations
9. **Seller Ratings**: Review system for sellers to build reputation
10. **Real-time Notifications**: Using WebSockets for instant updates 