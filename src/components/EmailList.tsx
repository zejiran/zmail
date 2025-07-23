import { useLocation, useNavigate } from 'react-router-dom'
import { useEmailStore } from '../store/emailStore'
import { CONFIG } from '../utils/constants'
import type { Email } from '../types'

export function EmailList() {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname.replace('/', '')
  const emails = useEmailStore((s) => s.emails)

  const filtered = emails.filter((email) => filterByFolder(email, path))

  return (
    <div className="p-4 flex flex-col gap-2">
      {filtered.length === 0 ? (
        <p className="text-gray-600 italic">No emails here.</p>
      ) : (
        filtered.map((email) => (
          <div
            key={email.id}
            onClick={() => navigate(`/thread/${email.threadId}`)}
            className={`border rounded p-3 shadow-sm cursor-pointer ${
              email.unread ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="font-medium">{email.from.name}</div>
              <div className="text-xs text-gray-500">{new Date(email.date).toLocaleString()}</div>
            </div>
            <div className="text-sm font-semibold">{email.subject}</div>
            <div className="text-sm text-gray-700 truncate">{email.body}</div>
          </div>
        ))
      )}
    </div>
  )
}

function filterByFolder(email: Email, folder: string): boolean {
  switch (folder) {
    case 'inbox':
      return !email.isSpam && !email.isTrash
    case 'spam':
      return email.isSpam
    case 'trash':
      return email.isTrash
    case 'starred':
      return (
        email.starred &&
        (!email.isTrash || CONFIG.showStarredSpamInStarred) &&
        (!email.isSpam || CONFIG.showStarredSpamInStarred)
      )
    case 'all':
      return true
    default:
      return false
  }
}
