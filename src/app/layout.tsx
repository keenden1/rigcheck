import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Rigcheck PH — Compare PC part prices', description: 'Track individual motherboard, CPU, RAM, storage, casing, and monitor prices in Philippine pesos.', icons: { icon: '/logo.png' } };
export default function Layout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
