import { LeftArrowIcon } from "../icons/LeftArrowIcon"

interface BackButtonProps {
  fallbackUrl: string
}

export default function BackButton ({ fallbackUrl }: BackButtonProps) {
  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Check if there's history to go back to
    if (window.history.length > 1 && document.referrer) {
      window.history.back()
    } else {
      // Fallback to the category page if no history
      window.location.href = fallbackUrl
    }
  }

  return (
    <a
      href={fallbackUrl}
      onClick={handleBack}
      className="flex gap-2 text-accent group cursor-pointer"
    >
      <div className="bg-accent rounded-full">
        <LeftArrowIcon />
      </div>
      <span className="underline-hover group-hover:after:origin-bottom group-hover:after:scale-x-100 group-active:after:scale-x-100 group-active:after:origin-bottom">
        Volver atrás
      </span>
    </a>
  )
}