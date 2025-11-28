import type { Metadata } from 'next'
import './globals.css'
import { ReactNode } from 'react'
import { Web3Provider } from '@/components/Web3Provider'

export const metadata: Metadata = {
  title: 'Park Snake - Play to Earn',
  description: 'A progressive park-themed snake game on Celo blockchain - Play to Earn rewards!',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2d5a1f" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gradient-to-b from-sky-light to-grass m-0 p-0 overflow-hidden">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
