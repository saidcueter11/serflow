import type React from "preact/compat"
import { CloseIcon } from "./icons/CloseIcon"

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
      class={`${isOpen ? 'translate-x-0 backdrop-blur-sm' : 'translate-x-full'} transition duration-300 fixed w-full z-10 inset-0 h-full flex flex-col items-end`}
    >
      <div class="bg-secondary h-full w-2/4 p-4">
        <button onClick={() => toggleSideMenu(false)}>
          <CloseIcon />
        </button>

        <div class='flex flex-col mt-4 gap-4 font-arvo font-semibold items-center'>
          <a href='/' data-astro-prefetch onClick={() => toggleSideMenu(false)}>Inicio</a>
          <a href='/products' data-astro-prefetch onClick={() => toggleSideMenu(false)}>Productos</a>
        </div>
      </div>
    </aside>
  )
}


