'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()

  const handleThemeChange = (newTheme: string) => {
    console.log('Changing theme to:', newTheme)
    setTheme(newTheme)
    
    // Force update if needed
    setTimeout(() => {
      const html = document.documentElement
      if (newTheme === 'light') {
        html.classList.remove('dark')
        html.classList.add('light')
      } else if (newTheme === 'dark') {
        html.classList.remove('light')
        html.classList.add('dark')
      } else {
        // System theme - let the system decide
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
          html.classList.remove('light')
          html.classList.add('dark')
        } else {
          html.classList.remove('dark')
          html.classList.add('light')
        }
      }
    }, 100)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Claro {theme === 'light' && '✓'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Escuro {theme === 'dark' && '✓'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('system')}>
          <span className="mr-2 h-4 w-4">💻</span>
          <span>Sistema {theme === 'system' && '✓'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
