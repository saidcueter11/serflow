
import { useState } from 'preact/hooks'
import type React from 'preact/compat'
import { MenuIcon } from './icons/MenuIcon'
import { SideMenu } from './SideMenu'

export const Header: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSideMenu = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <>
      <header class="flex justify-between items-end max-w-6xl mx-auto w-full">
        <a href="/">
          {children}
        </a>

        <button onClick={() => toggleSideMenu(!isOpen)} class='sm:hidden'>
          <MenuIcon />
        </button>

        <div class='hidden sm:flex gap-6 font-arvo prose prose-invert prose-a:no-underline'>
          <a class="hover:underline underline-offset-2 hover:text-accent transition" href="/">Inicio</a>
          <a class="hover:underline underline-offset-2 hover:text-accent transition" href="/products">Productos</a>
        </div>
      </header>

      <SideMenu isOpen={isOpen} toggleSideMenu={toggleSideMenu} />
    </>
  )
}


