import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Package, Sparkles, Loader2 } from "lucide-react";

export default function Storefront() {
  const [activeTab, setActiveTab] = useState("for-you");
  
  const { data: products, isLoading } = trpc.storefront.getRecommendations.useQuery();
  const { data: categories } = trpc.storefront.getCategories.useQuery();

  const forYouProducts = products?.filter((p) => p.personalized) || [];
  const allProducts = products || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#FFF8F0] to-[#E8DCC8]">
      <Navigation />
      
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#8B4513] mb-2">
                Gear
              </h1>
              <p className="text-[#6B5744] text-lg">
                Tools and resources to support your goals
              </p>
            </div>
            <div className="text-sm text-[#8B6F47] bg-[#FFF8F0] px-4 py-2 rounded-lg border border-[#E8DCC8]">
              <span className="font-medium">Affiliate Disclosure:</span> We may earn a commission from purchases
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#FFF8F0] border border-[#E8DCC8]">
            <TabsTrigger value="for-you" className="data-[state=active]:bg-[#C17817] data-[state=active]:text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              For You
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-[#C17817] data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              All Products
            </TabsTrigger>
            {categories && categories.length > 0 && (
              <TabsTrigger value="categories" className="data-[state=active]:bg-[#C17817] data-[state=active]:text-white">
                By Category
              </TabsTrigger>
            )}
          </TabsList>

          {/* For You Tab */}
          <TabsContent value="for-you" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#C17817]" />
              </div>
            ) : forYouProducts.length === 0 ? (
              <Card className="border-[#D4A574]">
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-12 w-12 text-[#C17817] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#8B4513] mb-2">
                    No personalized recommendations yet
                  </h3>
                  <p className="text-[#6B5744]">
                    Complete your onboarding and add goals to get personalized product suggestions!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forYouProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* All Products Tab */}
          <TabsContent value="all" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#C17817]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Categories Tab */}
          {categories && categories.length > 0 && (
            <TabsContent value="categories" className="space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="text-2xl font-serif font-semibold text-[#8B4513] mb-4">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allProducts
                      .filter((p) => p.category === category)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

type Product = {
  id: number;
  name: string;
  amazonUrl: string;
  imageUrl: string | null;
  price: string | null;
  whyItHelps: string;
  category: string;
  tags: string[];
  personalized?: boolean;
  matchedGoals?: string[];
};

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="border-[#D4A574] hover:shadow-lg transition-shadow overflow-hidden">
      {product.imageUrl && (
        <div className="aspect-square bg-[#FFF8F0] flex items-center justify-center p-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg font-semibold text-[#8B4513] line-clamp-2">
            {product.name}
          </CardTitle>
          {product.price && (
            <Badge variant="secondary" className="shrink-0 bg-[#C17817] text-white">
              {product.price}
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="w-fit text-[#8B6F47] border-[#D4A574]">
          {product.category}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {product.personalized && product.matchedGoals && product.matchedGoals.length > 0 && (
          <div className="bg-[#FFF8F0] p-3 rounded-lg border border-[#E8DCC8]">
            <div className="flex items-start space-x-2">
              <Sparkles className="h-4 w-4 text-[#C17817] mt-0.5 shrink-0" />
              <div className="text-sm text-[#6B5744]">
                <span className="font-medium">For your goal:</span>{" "}
                {product.matchedGoals[0]}
              </div>
            </div>
          </div>
        )}
        
        <CardDescription className="text-[#6B5744] line-clamp-3">
          {product.whyItHelps}
        </CardDescription>
        
        <Button
          asChild
          className="w-full bg-[#C17817] hover:bg-[#A66312]"
        >
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            View on Amazon
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
