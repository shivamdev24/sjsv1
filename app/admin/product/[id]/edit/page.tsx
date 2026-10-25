import Link from "next/link";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit product</h1>
        <p className="text-sm text-muted-foreground">Product ID: {id}</p>
      </div>

      <p className="text-sm text-muted-foreground">
        The product editing form will be implemented later.
      </p>

      <Link
        href="/admin/product"
        className="inline-flex text-sm font-medium underline underline-offset-4"
      >
        Back to products
      </Link>
    </div>
  );
}
