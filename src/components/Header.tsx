
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

        <button onClick={() => toggleSideMenu(!isOpen)} className="sm:hidden active:scale-110">
          <MenuIcon />
        </button>

        <div className="hidden sm:flex gap-6 font-vend-sans prose prose-invert prose-a:no-underline text-lg">
          <a
            href="/"
            data-astro-prefetch

            onClick={(e) => {
              e.preventDefault()
              toggleSideMenu(false)
              navigate('/', { history: 'push', sourceElement: e.currentTarget })
            }}
            className={`underline-hover ${activePath === '/' ? 'after:scale-x-100 after:origin-bottom' : ''}`}>Inicio</a>

          <a
            href="/products/miTierraQuerida"
            data-astro-prefetch
            onClick={(e) => {
              e.preventDefault()
              toggleSideMenu(false)
              navigate('/products/miTierraQuerida', { history: 'push', sourceElement: e.currentTarget })
            }}
            className={`underline-hover ${activePath.startsWith('/products') ? 'after:scale-x-100 after:origin-bottom' : ''}`}>Products</a>

          <a
            href="/nuestroEquipo"
            data-astro-prefetch
            onClick={(e) => {
              e.preventDefault()
              toggleSideMenu(false)
              navigate('/products', { history: 'push', sourceElement: e.currentTarget })
            }}
            className={`underline-hover ${activePath.startsWith('/nuestroEquipo') ? 'after:scale-x-100 after:origin-bottom' : ''}`}>Nuestro equipo</a>

          <a
            href="/sugerencias"
            data-astro-prefetch
            onClick={(e) => {
              e.preventDefault()
              toggleSideMenu(false)
              navigate('/products', { history: 'push', sourceElement: e.currentTarget })
            }}
            className={`underline-hover ${activePath.startsWith('/sugerencias') ? 'after:scale-x-100 after:origin-bottom' : ''}`}>Sugerencias</a>
        </div>
      </header>

      <SideMenu isOpen={isOpen} toggleSideMenu={toggleSideMenu} />
    </>
  )
}
