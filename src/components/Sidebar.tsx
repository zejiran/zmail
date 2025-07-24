import { NavLink } from 'react-router-dom'
import { useEmailStore } from '../store/emailStore'
import { CONFIG } from '../utils/constants'

const folders = [
  { key: 'inbox', name: 'Inbox', icon: 'inbox' },
  { key: 'starred', name: 'Starred', icon: 'star' },
  { key: 'all', name: 'All Mail', icon: 'mail' },
  { key: 'spam', name: 'Spam', icon: 'report' },
  { key: 'trash', name: 'Trash', icon: 'delete' },
] as const

export function Sidebar() {
  const emails = useEmailStore((s) => s.emails)

  const getCount = (folder: string) => {
    const getUniqueThreads = (filteredEmails: typeof emails) => {
      const threadIds = new Set(filteredEmails.map((e) => e.threadId))
      return threadIds.size
    }

    const getUnreadThreads = (filteredEmails: typeof emails) => {
      const unreadThreadIds = new Set()
      filteredEmails.forEach((email) => {
        if (email.unread) {
          unreadThreadIds.add(email.threadId)
        }
      })
      return unreadThreadIds.size
    }

    if (folder === 'inbox') {
      const inboxEmails = emails.filter((e) => !e.isSpam && !e.isTrash)
      return CONFIG.showTotalCountInsteadOfUnread
        ? getUniqueThreads(inboxEmails)
        : getUnreadThreads(inboxEmails)
    }
    if (folder === 'starred') {
      const starredEmails = emails.filter((e) => e.starred && !e.isSpam && !e.isTrash)
      return getUniqueThreads(starredEmails)
    }
    if (folder === 'spam') {
      const spamEmails = emails.filter((e) => e.isSpam)
      return getUniqueThreads(spamEmails)
    }
    if (folder === 'trash') {
      const trashEmails = emails.filter((e) => e.isTrash)
      return getUniqueThreads(trashEmails)
    }
    if (folder === 'all') {
      return getUniqueThreads(emails)
    }
    return 0
  }

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      <nav className="flex-1 py-2">
        {folders.map((folder) => {
          const count = getCount(folder.key)
          return (
            <NavLink
              key={folder.key}
              to={`/${folder.key}`}
              className={({ isActive }) =>
                `relative flex items-center justify-between px-4 py-3 mx-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <div className="flex items-center gap-4">
                <span className="material-icons text-lg">{folder.icon}</span>
                <span>{folder.name}</span>
              </div>
              {(folder.key === 'inbox' || folder.key === 'spam') && count > 0 && (
                <span className="text-xs text-gray-600 font-normal min-w-[20px] text-right">
                  {count}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
