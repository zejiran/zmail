import { useLocation, useNavigate } from 'react-router-dom'
import { useEmailStore } from '../store/emailStore'
import type { Email } from '../types'
import { formatRelativeTime } from '../utils/time'

export const EmailList = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname.replace('/', '')
  const { emails, toggleStar, toggleThreadStar, getFilteredEmails, searchQuery } = useEmailStore()

  const threadMap = new Map<string, Email>()
  const threadUnreadMap = new Map<string, boolean>()

  // First pass: collect all filtered emails and track unread status per thread
  const filteredEmails = getFilteredEmails(path)

  filteredEmails.forEach((email) => {
    // Track if any email in this thread is unread
    const currentUnread = threadUnreadMap.get(email.threadId) || false
    threadUnreadMap.set(email.threadId, currentUnread || email.unread)

    // Keep the latest email for each thread
    const existing = threadMap.get(email.threadId)
    if (!existing || new Date(email.date).getTime() > new Date(existing.date).getTime()) {
      threadMap.set(email.threadId, email)
    }
  })

  // Create final filtered list with thread-level unread and starred status
  const filtered = Array.from(threadMap.values())
    .map((email) => {
      const threadEmails = emails.filter((e) => e.threadId === email.threadId)
      const threadStarred = threadEmails.some((e) => e.starred)

      return {
        ...email,
        unread: threadUnreadMap.get(email.threadId) || false,
        starred: threadStarred,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleStarClick = (e: React.MouseEvent, email: Email) => {
    e.stopPropagation()

    // For parent folders (inbox, spam, trash, all), use thread-level starring
    // For starred folder or thread view, use individual email starring
    if (path === 'starred') {
      toggleStar(email.id)
    } else {
      toggleThreadStar(email.threadId, path)
    }
  }

  const handleEmailClick = (email: Email) => {
    navigate(`/thread/${email.threadId}`)
  }

  const showStarButton = path !== 'trash'

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden">
      {filtered.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 text-lg">Empty</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {searchQuery && (
            <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Search results for "{searchQuery}" ({filtered.length} found)
              </p>
            </div>
          )}
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
                    onClick={(e) => handleStarClick(e, email)}
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
                  <span>{formatSenderNameWithCount(email.from.name, email.threadId, emails)}</span>
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

function formatSenderNameWithCount(name: string, threadId: string, allEmails: Email[]) {
  const threadEmails = allEmails.filter((email) => email.threadId === threadId)

  if (threadEmails.length <= 1) {
    return <span>{name}</span>
  }

  const uniqueSenders = Array.from(new Set(threadEmails.map((email) => email.from.name)))

  if (uniqueSenders.length === 1) {
    return <span>{name}</span>
  }

  const senderNames =
    uniqueSenders.length === 2 ? uniqueSenders.join(', ') : uniqueSenders.slice(0, 2).join(', ')

  return (
    <span>
      {senderNames}
      <span className="text-xs text-gray-400 font-normal ml-1">({uniqueSenders.length})</span>
    </span>
  )
}
