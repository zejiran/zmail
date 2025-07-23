import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { useEmailStore } from '../store/emailStore'
import type { Email } from '../types'
import { CONFIG } from '../utils/constants'

const folders = ['inbox', 'starred', 'spam', 'trash', 'all'] as const

export function Sidebar() {
  const emails = useEmailStore((s) => s.emails)

  const getCount = (folder: string) => {
    if (folder === 'inbox') {
      return CONFIG.showTotalCountInsteadOfUnread
        ? emails.filter((e) => !e.isSpam && !e.isTrash).length
        : emails.filter((e) => !e.isSpam && !e.isTrash && e.unread).length
    }
    if (folder === 'starred') {
      return emails.filter((e) => e.starred && includeInFolder(e, folder)).length
    }
    if (folder === 'spam') {
      return emails.filter((e) => e.isSpam).length
    }
    if (folder === 'trash') {
      return emails.filter((e) => e.isTrash).length
    }
    if (folder === 'all') {
      return emails.length
    }
    return 0
  }

  const includeInFolder = (email: Email, folder: string) => {
    if (folder === 'starred') {
      return (
        email.starred &&
        (!email.isTrash || CONFIG.showStarredSpamInStarred) &&
        (!email.isSpam || CONFIG.showStarredSpamInStarred)
      )
    }
    return true
  }

  return (
    <aside className="w-64 p-4 border-r border-gray-300 h-screen bg-white">
      <nav className="flex flex-col gap-2">
        {folders.map((folder) => (
          <NavLink
            key={folder}
            to={`/${folder}`}
            className={({ isActive }) =>
              clsx(
                'text-sm px-3 py-2 rounded hover:bg-gray-100 flex justify-between',
                isActive && 'bg-gray-200 font-semibold'
              )
            }
          >
            <span className="capitalize">{folder}</span>
            <span>{getCount(folder)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
