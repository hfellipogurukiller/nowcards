'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface LogoProps {
  className?: string
  alt?: string
}

export function Logo({ className = "h-10 w-auto", alt = "nowcards" }: LogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Show default logo during hydration
    return <img src="/logo.png" alt={alt} className={className} />
  }

  // Use the new logo with blue background for light mode
  // Use the original logo for dark mode
  const logoSrc = resolvedTheme === 'dark' ? '/logo.png' : '/logo_s_fundo - Edited.png'

  return <img src={logoSrc} alt={alt} className={className} />
}
