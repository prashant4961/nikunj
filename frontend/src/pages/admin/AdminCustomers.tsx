import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';

type Customer = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  _count: { orders: number };
};

export function AdminCustomers() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async () => (await api.get<{ customers: Customer[] }>('/admin/customers')).data.customers,
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink-900">Customers</h1>
        <p className="text-sm text-ink-500">{data?.length ?? 0} registered shoppers</p>
      </header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-brand-50/70 text-left text-xs font-bold uppercase tracking-wide text-brand-800">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Orders</th>
                <th className="px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-5 py-6">
                    <div className="skeleton h-10 rounded-lg" />
                  </td>
                </tr>
              )}

              {(data ?? []).map((customer) => (
                <tr key={customer.id} className="hover:bg-brand-50/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-xs font-bold text-gold-300">
                        {customer.fullName.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-semibold text-ink-900">{customer.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-700">
                    <p>{customer.email}</p>
                    <p className="text-xs text-ink-500">{customer.phone}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="chip bg-brand-50 text-brand-700">
                      {customer._count.orders} orders
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-500">{formatDate(customer.createdAt)}</td>
                </tr>
              ))}

              {!isLoading && (data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-ink-500">
                    No customers have registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
