import Image from "next/image"
import { ORGANIZER_NAME, ORGANIZER_ORG, LOCATION } from "@/lib/constants"

interface JTQHeaderProps {
  title?: string
}

export default function JTQHeader({ title }: JTQHeaderProps) {
  return (
    <header className="w-full py-6 px-4 text-center">
      <div className="flex items-center justify-center gap-4">
        <Image
          src="/logo-jtq.svg"
          alt="JTQ"
          width={60}
          height={60}
          className="h-[60px] w-auto object-contain"
          priority
        />
        <Image
          src="/logo-ctm08.svg"
          alt="CTM 08"
          width={60}
          height={60}
          className="h-[60px] w-auto object-contain"
          priority
        />
      </div>
      <h1 className="mt-3 text-lg font-bold text-jtq-text">
        {ORGANIZER_NAME}
      </h1>
      <p className="text-sm text-jtq-muted">
        {ORGANIZER_ORG} &middot; {LOCATION}
      </p>
      {title && (
        <p className="mt-2 text-base font-semibold text-jtq-primary">
          {title}
        </p>
      )}
    </header>
  )
}
