import type {Metadata} from 'next';
import {IBM_Plex_Mono, IBM_Plex_Sans} from 'next/font/google';
import './globals.css';

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: '3CORP | Portal Telecom',
  description: 'Operação financeira de fornecedores, documentos e encaminhamentos',
};

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
