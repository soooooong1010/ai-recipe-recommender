import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Gowun_Dodum, Gowun_Batang } from 'next/font/google'
import './globals.css'

const _gowunDodum = Gowun_Dodum({ subsets: ['latin'], weight: '400' })
const _gowunBatang = Gowun_Batang({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: '냉털 레시피 · 사진 한 장으로 오늘 뭐 먹지 해결',
  description:
    '냉장고 속 식재료 사진과 보유 조미료만 알려주면 AI가 자취생용 레시피를 추천해주는 서비스',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdf8ef' },
    { media: '(prefers-color-scheme: dark)', color: '#241f1b' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
