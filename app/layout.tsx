import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'idle garden clock',description:'do nothing. the garden grows. touch it and it holds its breath.',applicationName:'idle garden clock'};
export const viewport: Viewport = {width:'device-width',initialScale:1,themeColor:'#e9eadc'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
