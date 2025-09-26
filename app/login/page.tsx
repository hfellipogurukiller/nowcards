import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-between items-center mb-4">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao início
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <div className="flex flex-col items-center gap-4">
            <Logo className="h-12 w-auto" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">NowCards</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sistema de flashcards para estudos
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
