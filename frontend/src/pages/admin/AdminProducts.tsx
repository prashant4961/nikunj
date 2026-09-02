import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { api, apiErrorMessage } from '@/lib/api';
import { discountPercent, formatPrice } from '@/lib/format';
import { toast } from '@/store/toast';
import type { Product } from '@/types';

type FormState = {
  name: string;
  description: string;
  category: string;
  price: string;
  mrp: string;
  image: string;
  stock: string;
  featured: boolean;
};

const emptyForm: FormState = {
  name: '',
  description: '',
  category: 'Necklace Sets',
  price: '',
  mrp: '',
  image: '/images/products/set-1.jpeg',
  stock: '10',
  featured: false,
};

const categories = [
  'Necklace Sets',
  'Bridal Collection',
  'Temple Jewellery',
  'Earrings',
  'Bangles & Bracelets',
  'Rings',
  'Anklets',
];

const imageChoices = Array.from({ length: 21 }, (_, i) => `/images/products/set-${i + 1}.jpeg`);

function ProductDialog({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(
    product
      ? {
          name: product.name,
          description: product.description,
          category: product.category,
          price: String(product.price),
          mrp: String(product.mrp),
          image: product.image,
          stock: String(product.stock),
          featured: product.featured,
        }
      : emptyForm,
  );

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        mrp: Number(form.mrp),
        image: form.image,
        gallery: [form.image],
        stock: Number(form.stock),
        featured: form.featured,
      };
      if (product) return api.put(`/admin/products/${product.id}`, payload);
      return api.post('/admin/products', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(product ? 'Product updated' : 'Product added');
      onClose();
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not save this product')),
  });

  const set = (key: keyof FormState) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-pop sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            {product ? 'Edit product' : 'Add new product'}
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-ink-500" />
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <div>
            <label className="label">Product name</label>
            <input
              required
              className="field"
              value={form.name}
              onChange={(event) => set('name')(event.target.value)}
              placeholder="Kundan Bridal Necklace Set"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              required
              rows={3}
              className="field resize-none"
              value={form.description}
              onChange={(event) => set('description')(event.target.value)}
              placeholder="Materials, finish, what makes it special…"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Category</label>
              <select
                className="field"
                value={form.category}
                onChange={(event) => set('category')(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Stock</label>
              <input
                required
                type="number"
                min={0}
                className="field"
                value={form.stock}
                onChange={(event) => set('stock')(event.target.value)}
              />
            </div>
            <div>
              <label className="label">Selling price (₹)</label>
              <input
                required
                type="number"
                min={1}
                className="field"
                value={form.price}
                onChange={(event) => set('price')(event.target.value)}
              />
            </div>
            <div>
              <label className="label">MRP (₹)</label>
              <input
                required
                type="number"
                min={1}
                className="field"
                value={form.mrp}
                onChange={(event) => set('mrp')(event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Image</label>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {imageChoices.map((image) => (
                <button
                  type="button"
                  key={image}
                  onClick={() => set('image')(image)}
                  className={
                    form.image === image
                      ? 'h-16 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-brand-600'
                      : 'h-16 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-transparent opacity-70'
                  }
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <input
              className="field mt-2"
              value={form.image}
              onChange={(event) => set('image')(event.target.value)}
              placeholder="/images/products/set-1.jpeg"
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => set('featured')(event.target.checked)}
              className="h-4 w-4 rounded border-black/20 text-brand-700 focus:ring-brand-400"
            />
            Show on the homepage bestsellers row
          </label>

          <div className="flex gap-3 pt-2">
            <button className="btn-primary flex-1" disabled={save.isPending}>
              {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {product ? 'Save changes' : 'Add product'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminProducts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => (await api.get<{ products: Product[] }>('/admin/products')).data.products,
  });

  const remove = useMutation({
    mutationFn: async (id: number) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not delete this product')),
  });

  const products = (data ?? []).filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="font-display text-2xl font-bold text-ink-900">Products</h1>
          <p className="text-sm text-ink-500">{data?.length ?? 0} designs in the catalogue</p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="field w-56 py-2.5 pl-10"
          />
        </div>

        <button onClick={() => setDialog({ open: true, product: null })} className="btn-primary py-2.5">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-brand-50/70 text-left text-xs font-bold uppercase tracking-wide text-brand-800">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-5 py-4">
                      <div className="skeleton h-10 rounded-lg" />
                    </td>
                  </tr>
                ))}

              {products.map((product) => (
                <tr key={product.id} className="hover:bg-brand-50/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt=""
                        className="h-12 w-10 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-semibold text-ink-900">{product.name}</p>
                        <p className="text-xs text-ink-500">#{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-700">{product.category}</td>
                  <td className="px-5 py-3">
                    <p className="font-semibold">{formatPrice(product.price)}</p>
                    <p className="text-xs text-emerald-600">
                      {discountPercent(product.price, product.mrp)}% off
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        product.stock > 0
                          ? 'chip bg-emerald-100 text-emerald-700'
                          : 'chip bg-rose-100 text-rose-700'
                      }
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDialog({ open: true, product })}
                        className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700 transition hover:bg-brand-100"
                        aria-label="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete “${product.name}”?`)) remove.mutate(product.id);
                        }}
                        className="grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        aria-label="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-ink-500">
                    No products match this search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {dialog.open && (
        <ProductDialog
          product={dialog.product}
          onClose={() => setDialog({ open: false, product: null })}
        />
      )}
    </div>
  );
}
