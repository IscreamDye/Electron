import './globals.css'
import AppLifecycle from '@/components/AppLifecycle'

export const metadata = {
  title: 'Electron',
  description: 'Coding puzzle game'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppLifecycle />
        {children}
      </body>
    </html>
  )
}
