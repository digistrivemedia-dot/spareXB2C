import type { Product } from "@/features/catalog/types";

/** Specifications as a two-column table, starting with the identifiers garages ask for. */
export function ProductSpecs({ product }: { product: Product }) {
  const rows = [
    { label: "Brand", value: product.brand.name },
    { label: "Part number", value: product.partNumber },
    { label: "SKU", value: product.sku },
    { label: "Category", value: product.category.name },
    ...product.specs,
    {
      label: "Warranty",
      value: product.warrantyMonths ? `${product.warrantyMonths} months` : "No warranty",
    },
  ];

  return (
    <table className="w-full max-w-2xl text-sm">
      <caption className="sr-only">Specifications</caption>
      <tbody className="divide-y divide-gray-200">
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row" className="w-2/5 py-3 pr-4 text-left font-medium text-gray-600">
              {row.label}
            </th>
            <td className="py-3 text-gray-900">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
