import type { Product } from "@/types";
import { ObjectCard } from "./object-card";

interface ObjectGridProps {
  products: Product[];
}

export function ObjectGrid({ products }: ObjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ObjectCard key={product.id} product={product} />
      ))}
    </div>
  );
}
