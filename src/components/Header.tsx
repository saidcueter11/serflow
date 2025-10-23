
import React, { useEffect, useState } from 'react'
import { MenuIcon } from './icons/MenuIcon'
import { SideMenu } from './SideMenu'
import { navigate } from 'astro:transitions/client'

interface HeaderProps {
  children: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activePath, setActivePath] = useState('/')

  const toggleSideMenu = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  useEffect(() => {
    const updatePath = () => setActivePath(window.location.pathname)
    updatePath()
    document.addEventListener('astro:after-swap', updatePath)
    return () => document.removeEventListener('astro:after-swap', updatePath)
  }, [])

  return (
    <>

      <header className="flex justify-between items-end mx-w-6xl mx-uto w-full">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            toggleSideMenu(false)
            navigate('/', { history: 'push', sourceElement: e.currentTarget })
          }}
        >
          {children}
        </a>

        <button onClick={() => toggleSideMenu(!isOpen)} className="sm:hidden">
          <MenuIcon />
        </button>

        <div className="hidden sm:flex gap-6 font-titan prose prose-invert prose-a:no-underline text-lg">
          <a
            href="/"
            data-astro-prefetch

            onClick={(e) => {
              e.preventDefault()
              toggleSideMenu(false)
              navigate('/', { history: 'push', sourceElement: e.currentTarget })
            }}
            className={`relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full after:origin-bottom after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100 ${activePath === '/' ? 'after:scale-x-100 after:origin-bottom' : ''}`}>Inicio</a>

          <a
            href="/products"
            data-astro-prefetch
            onClick={(e) => {
              e.preventDefault()
              toggleSideMenu(false)
              navigate('/products', { history: 'push', sourceElement: e.currentTarget })
            }}
            className={`relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full after:origin-bottom after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100 ${activePath.startsWith('/products') ? 'after:scale-x-100 after:origin-bottom' : ''}`}>Products</a>

          <a
            href="/nuestroEquipo"
            data-astro-prefetch
            onClick={(e) => {
              e.preventDefault()
              toggleSideMenu(false)
              navigate('/products', { history: 'push', sourceElement: e.currentTarget })
            }}
            className={`relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full after:origin-bottom after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100 ${activePath.startsWith('/nuestroEquipo') ? 'after:scale-x-100 after:origin-bottom' : ''}`}>Nuestro equipo</a>

          <a
            href="/sugerencias"
            data-astro-prefetch
            onClick={(e) => {
              e.preventDefault()
              toggleSideMenu(false)
              navigate('/products', { history: 'push', sourceElement: e.currentTarget })
            }}
            className={`relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full after:origin-bottom after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100 ${activePath.startsWith('/sugerencias') ? 'after:scale-x-100 after:origin-bottom' : ''}`}>Sugerencias</a>
        </div>
      </header>

      <SideMenu isOpen={isOpen} toggleSideMenu={toggleSideMenu} />
    </>
  )
}
