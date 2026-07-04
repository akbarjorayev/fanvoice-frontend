import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faInstagram, faYoutube, faTiktok, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { SocialLink, Platform } from '@/types/social-link'

const ICONS: Record<Platform, IconDefinition> = {
  twitter:   faXTwitter,
  instagram: faInstagram,
  youtube:   faYoutube,
  tiktok:    faTiktok,
  telegram:  faTelegram,
  github:    faGithub,
  website:   faGlobe,
}

const COLORS: Record<Platform, string> = {
  twitter:   '#000000',
  instagram: '#E1306C',
  youtube:   '#FF0000',
  tiktok:    '#000000',
  telegram:  '#2AABEE',
  github:    '#333333',
  website:   '#6B7280',
}

interface Props {
  links: SocialLink[]
}

export function SocialLinks({ links }: Props) {
  if (links.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => {
        const icon = ICONS[link.platform as Platform] ?? faGlobe
        const color = COLORS[link.platform as Platform] ?? '#6B7280'
        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.url}
            style={{ '--link-color': color } as React.CSSProperties}
            className="group inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-[var(--link-color)] hover:bg-[var(--link-color)] transition-all"
          >
            <FontAwesomeIcon
              icon={icon}
              className="text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors"
              style={{ width: 15, height: 15 }}
            />
          </a>
        )
      })}
    </div>
  )
}
