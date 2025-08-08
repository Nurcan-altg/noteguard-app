import { BookOpen, Sparkles } from 'lucide-react'

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-border z-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">NoteGuard</h1>
            <p className="text-xs text-text-secondary">Text Analysis Tool</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-text-secondary">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Analysis</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 