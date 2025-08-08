import { ReactNode } from 'react'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background-secondary">
      <Header />
      <main className="pt-[72px] min-h-screen">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout 