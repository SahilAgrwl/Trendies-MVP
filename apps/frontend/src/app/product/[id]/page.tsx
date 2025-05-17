import { Product } from "@/types/product";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button, Badge } from "@mantine/core";

async function getProduct(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/products/${id}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage(props: ProductPageProps) {
  // Explicitly await the params object using Promise.resolve
  const { id } = await Promise.resolve(props.params);
  
  if (!id) {
    notFound();
  }
  
  const product: Product = await getProduct(id);

  if (!product || product.status !== "validated") {
    notFound();
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="relative h-[500px] md:h-[600px] group overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transform transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute top-4 left-4">
            <Badge 
              color="blue" 
              size="lg"
              className="font-medium px-3 py-1 bg-blue-600 text-white shadow-md"
            >
              {product.category}
            </Badge>
          </div>
        </div>

        <div className="p-8 flex flex-col">
          <div className="mb-6 flex-grow">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center mt-2 mb-6">
              <div className="h-px flex-grow bg-gradient-to-r from-pink-200 to-transparent"></div>
              <p className="mx-4 text-3xl font-bold text-pink-600">
                ${product.price.toFixed(2)}
              </p>
              <div className="h-px flex-grow bg-gradient-to-l from-pink-200 to-transparent"></div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Product Details</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Seller Information</h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Seller:</span> {product.sellerName}
              </p>
              <div className="flex items-center mt-4">
                <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Verified Seller</p>
                  <p className="text-xs text-gray-500">This product has been verified by our team</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button 
              size="xl"
              fullWidth
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-px transition-all duration-300 h-14 rounded-xl font-medium"
              component="a"
              href={`/product/${id}/checkout`}
            >
              Add to Cart
            </Button>
            
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 