const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number) => currency.format(value);

export const discountPercent = (price: number, mrp: number) =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const deliveryEstimate = (orderDate: string) => {
  const date = new Date(orderDate);
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};
