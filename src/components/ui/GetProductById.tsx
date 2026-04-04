"use client";
import { useGetProductByIdQuery } from "@/lib/features/products/product-api";
import { useState } from "react";

export default function GetProductById() {
  const [inputId, setInputId] = useState("");
  const [fetchId, setFetchId] = useState<number | null>(null);

  const { data, isLoading, isError, isFetching } = useGetProductByIdQuery(
    fetchId!,
    { skip: fetchId === null },
  );

  const handleFetch = () => {
    const id = parseInt(inputId);
    if (!isNaN(id) && id > 0) setFetchId(id);
  };

  return (
    <section 
      className="p-6 bg-white rounded-xl shadow-sm border border-zinc-100 max-w-md mx-auto"
    >
      <h2 className="text-base font-bold mb-3"> Get Product by ID</h2>

      <div className="flex gap-2">
        <input
          type="number"
          min={1}
          placeholder="Enter ID e.g. 1"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
          className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleFetch}
          disabled={isLoading || isFetching}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isLoading || isFetching ? "Loading…" : "Fetch"}
        </button>
      </div>

      {isError && (
        <p className="mt-3 text-sm text-red-500 font-medium">
          Product not found.
        </p>
      )}

      {data && (
        <div className="mt-4 rounded-xl border border-zinc-100 overflow-hidden">
          {data.images?.[0] && (
            <img
              src={data.images[0]}
              alt={data.title}
              className="w-full h-36 object-cover"
            />
          )}
          <div className="p-4">
            <p className="text-xs text-blue-500 font-bold uppercase tracking-wide mb-1">
              #{data.id} · {data.category?.name}
            </p>
            <p className="font-bold text-sm">{data.title}</p>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {data.description}
            </p>
            <p className="font-bold text-base mt-2">${data.price}</p>
          </div>
        </div>
      )}
    </section>
  );
}