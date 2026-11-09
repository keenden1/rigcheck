export const categories = ['Motherboard', 'CPU', 'RAM', 'Storage', 'Casing', 'Monitor'] as const;
export type Category = string;
export type Quote = { price: number | null; source: string; checked: string; title?: string };
export type Item = { id: string; name: string; category: Category; specs: string; saved: boolean; image?: string; retail: Quote; used: Quote };
export const emptyQuote = (): Quote => ({ price: null, source: '', checked: '' });
export const blankItem = (category: Category = 'Motherboard'): Item => ({ id: crypto.randomUUID(), name: '', category, specs: '', saved: false, retail: emptyQuote(), used: emptyQuote() });
export function validQuote(value: unknown): value is Quote {
 if (!value || typeof value !== 'object') return false;
 const q = value as Quote;
 return (q.price === null || (typeof q.price === 'number' && Number.isFinite(q.price) && q.price > 0)) && typeof q.source === 'string' && (!q.source || /^https?:\/\//i.test(q.source)) && typeof q.checked === 'string' && (!q.checked || (/^\d{4}-\d{2}-\d{2}$/.test(q.checked) && Number.isFinite(Date.parse(q.checked)))) && (q.title===undefined || typeof q.title==='string') && (q.price === null || !!(q.source && q.checked));
}
export function validItem(value: unknown): value is Item {
 if (!value || typeof value !== 'object') return false;
 const i = value as Item;
 return typeof i.id === 'string' && !!i.id && typeof i.name === 'string' && !!i.name.trim() && typeof i.category==='string' && !!i.category.trim() && i.category.length<=40 && typeof i.specs === 'string' && typeof i.saved === 'boolean' && (i.image===undefined || (typeof i.image==='string' && /^https:\/\//i.test(i.image))) && validQuote(i.retail) && validQuote(i.used);
}
export const starterItems: Item[] = categories.map((category, index) => ({ id: `starter-${index}`, category, name: ['MSI B450M PRO-VDH MAX', 'AMD Ryzen 5 5600', '16 GB DDR4-3200', '500 GB NVMe SSD', 'Tecware Nexus Air M2', '24-inch Full HD monitor'][index], specs: 'Example item • add the exact model and price sources', saved: false, retail: emptyQuote(), used: emptyQuote() }));
