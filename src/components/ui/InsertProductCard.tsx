"use client";
import { useAddProductMutation } from "@/lib/features/products/product-api";
import { CreateProductInput, ProductResponse } from "@/lib/types/product-type";
import { useState } from "react";


const EMPTY: CreateProductInput = {
  title: "",
  price: 0,
  description: "",
  categoryId: 1,
  images: ["https://placehold.co/600x400"],
};

export default function InsertProduct() {
  const [form, setForm] = useState<CreateProductInput>(EMPTY);
  const [imageUrl, setImageUrl] = useState("https://placehold.co/600x400");
  const [result, setResult] = useState<ProductResponse | null>(null);
  const [validErr, setValidErr] = useState("");

  const [addProduct, { isLoading, isError }] = useAddProductMutation();

  const set = (key: keyof CreateProductInput, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return setValidErr("Title is required.");
    if (form.price <= 0) return setValidErr("Price must be greater than 0.");
    if (!form.description.trim())
      return setValidErr("Description is required.");
    setValidErr("");

    try {
      const payload: CreateProductInput = {
        ...form,
        images: [imageUrl || "https://placehold.co/600x400"],
      };

      const data = await addProduct(payload).unwrap();
      setResult(data);
      setForm(EMPTY);
      setImageUrl("https://placehold.co/600x400");
    } catch {}
  };

  return (
    <section className="p-6 bg-white rounded-xl shadow-sm border border-zinc-100 max-w-lg mx-auto">
      <h2 className="text-base font-bold mb-4"> Insert New Product</h2>

      <div className="flex flex-col gap-3">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
            Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Wireless Headphones"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Price + Category */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
              Price *
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              placeholder="29.99"
              value={form.price || ""}
              onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
              className="border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
              Category ID *
            </label>
            <input
              type="number"
              min={1}
              placeholder="1"
              value={form.categoryId || ""}
              onChange={(e) => set("categoryId", parseInt(e.target.value) || 1)}
              className="border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
            Description *
          </label>
          <textarea
            placeholder="Describe the product…"
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          />
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
            Image URL
          </label>
          <input
            type="url"
            placeholder="https://…"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Errors */}
        {validErr && (
          <p className="text-sm text-red-500 font-medium">{validErr}</p>
        )}
        {isError && (
          <p className="text-sm text-red-500 font-medium">
            Server error. Please try again.
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-1 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 disabled:opacity-50 transition"
        >
          {isLoading ? "Creating…" : " Create Product"}
        </button>
      </div>

      {/* Success */}
      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl">
          <p className="text-green-700 font-bold text-sm">
            Created! ID: #{result.id}
          </p>
          <p className="text-sm font-semibold mt-1">{result.title}</p>
          <p className="text-xs text-zinc-400">
            ${result.price} · Category #{result.category?.id}
          </p>
        </div>
      )}
    </section>
  );
}