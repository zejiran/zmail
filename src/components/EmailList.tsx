import { useLocation, useNavigate } from 'react-router-dom'
import { useEmailStore } from '../store/emailStore'

import type { Email } from '../types'
import { formatRelativeTime } from '../utils/time'

export const EmailList = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname.replace('/', '')
  const { emails, toggleStar } = useEmailStore()

  const filtered = emails
    .filter((email) => filterByFolder(email, path))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleStarClick = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation()
    toggleStar(emailId)
  }

  const handleEmailClick = (email: Email) => {
    navigate(`/thread/${email.threadId}`)
  }

  // Don't show star button in trash
  const showStarButton = path !== 'trash'

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden">
      {filtered.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 text-lg">Empty</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filtered.map((email) => (
            <div
              key={email.id}
              onClick={() => handleEmailClick(email)}
              className={`flex items-center px-6 py-3 cursor-pointer transition-all duration-150 ${
                email.unread
                  ? 'bg-white hover:bg-blue-50 hover:shadow-sm border-l-4 border-transparent'
                  : 'bg-gray-50 hover:bg-gray-100 hover:shadow-sm border-l-4 border-transparent'
              }`}
            >
              {showStarButton && (
                <div className="flex items-center w-8">
                  <button
                    onClick={(e) => handleStarClick(e, email.id)}
                    className="hover:bg-gray-100 rounded transition-colors"
                  >
                    <span
                      className={`material-icons text-lg ${
                        email.starred ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400'
                      }`}
                    >
                      {email.starred ? 'star' : 'star_border'}
                    </span>
                  </button>
                </div>
              )}

              <div className="w-48 flex-shrink-0 pl-2">
                <div
                  className={`text-sm truncate ${
                    email.unread ? 'font-bold text-black' : 'font-normal text-gray-600'
                  }`}
                >
                  {formatSenderName(email.from.name, email.threadId, emails)}
                </div>
              </div>

              {/* Subject and preview */}
              <div className="flex-1 min-w-0 pl-4 pr-6">
                <div className="text-sm truncate">
                  <span
                    className={email.unread ? 'font-bold text-black' : 'font-normal text-gray-600'}
                  >
                    {email.subject}
                  </span>
                  <span className="text-gray-500 font-normal ml-2">- {email.body}</span>
                </div>
              </div>

              <div className="w-16 flex-shrink-0 text-right">
                <div className="text-xs text-gray-500">{formatRelativeTime(email.date)}</div>
              </div>
            </div>
          ))}
        </div>
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
      return email.starred && !email.isSpam && !email.isTrash
    case 'all':
      return true
    default:
      return false
  }
}

function formatSenderName(name: string, threadId: string, allEmails: Email[]): string {
  const threadEmails = allEmails.filter((email) => email.threadId === threadId)

  if (threadEmails.length <= 1) {
    return name
  }

  const uniqueSenders = Array.from(new Set(threadEmails.map((email) => email.from.name)))

  if (uniqueSenders.length === 1) {
    return name
  }

  if (uniqueSenders.length === 2) {
    return uniqueSenders.join(', ')
  }

  // For more than 2 senders, show first two and count
  const otherCount = uniqueSenders.length - 2
  return `${uniqueSenders.slice(0, 2).join(', ')} (${otherCount + 2})`
}
