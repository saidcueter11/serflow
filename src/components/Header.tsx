
import { useState } from 'preact/hooks'
import type React from 'preact/compat'
import { MenuIcon } from './icons/MenuIcon'
import { SideMenu } from './SideMenu'
import { navigate } from 'astro:transitions/client'

export const Header: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSideMenu = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <>
      <header class="flex justify-between items-end max-w-6xl mx-auto w-full">
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

        <button onClick={() => toggleSideMenu(!isOpen)} class='sm:hidden'>
          <MenuIcon />
        </button>

        <div class='hidden sm:flex gap-6 font-arvo prose prose-invert prose-a:no-underline'>
          <a
            href="/"
            class="hover:underline underline-offset-2 hover:text-accent transition"
            data-astro-prefetch
            onClick={(e) => {
              e.preventDefault()
              toggleSideMenu(false)
              navigate('/', { history: 'push', sourceElement: e.currentTarget })
            }}
          >
            Inicio
          </a>
          <a
            href="/products"
            data-astro-prefetch
            class="hover:underline underline-offset-2 hover:text-accent transition"
            onClick={(e) => {
              e.preventDefault()
              toggleSideMenu(false)
              navigate('/products', { history: 'push', sourceElement: e.currentTarget })
            }}
          >
            Productos
          </a>
        </div>
      </header>

      <SideMenu isOpen={isOpen} toggleSideMenu={toggleSideMenu} />
    </>
  )
}


