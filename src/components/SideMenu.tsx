import React from "react"
import { CloseIcon } from "./icons/CloseIcon"
import { navigate } from "astro:transitions/client"

interface SideMenuProps {
  isOpen: boolean
  toggleSideMenu: (isOpen: boolean) => void
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, toggleSideMenu }) => {
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === 'sideMenuOverlay') {
      toggleSideMenu(false)
    }
  }

  return (
    <aside
      id="sideMenuOverlay"
      onClick={handleOutsideClick}
      className={`${isOpen ? 'translate-x-0 backdrop-blur-sm' : 'translate-x-full'} transition duration-300 fixed w-full z-50 inset-0 h-full flex flex-col items-end text-xl`}
    >
      <div className="bg-secondary h-full p-4 w-2/4">
        <button onClick={() => toggleSideMenu(false)}>
          <CloseIcon />
        </button>

        <div className='flex flex-col mt-4 gap-4 font-arvo font-semibold items-center'>
          <a
            href="/"
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
            onClick={(e) => {
              e.preventDefault()
              toggleSideMenu(false)
              navigate('/products', { history: 'push', sourceElement: e.currentTarget })
            }}
          >
            Productos
          </a>
        </div>
      </div>
    </aside>
  )
}


