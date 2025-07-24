import { useParams, useNavigate } from 'react-router-dom'
import { useEmailStore } from '../store/emailStore'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { Email } from '../types'
import { formatFullDate } from '../utils/time'

export const ThreadView = () => {
  const readOnceRef = useRef<Set<string>>(new Set())
  const { threadId } = useParams<{ threadId: string }>()
  const navigate = useNavigate()
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set())

  const { emails, markEmailAsRead, toggleStar, moveToSpam, moveToTrash, moveToInbox } =
    useEmailStore(
      useShallow((s) => ({
        emails: s.emails,
        markEmailAsRead: s.markEmailAsRead,
        toggleStar: s.toggleStar,
        moveToSpam: s.moveToSpam,
        moveToTrash: s.moveToTrash,
        moveToInbox: s.moveToInbox,
      }))
    )

  const threadEmails = useMemo(
    () =>
      emails
        .filter((e: Email) => e.threadId === threadId)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [emails, threadId]
  )

  // Determine current context based on email properties
  const isSpamThread = threadEmails.some((email) => email.isSpam)
  const isTrashThread = threadEmails.some((email) => email.isTrash)

  // Initialize expanded state - only newest email expanded by default
  useEffect(() => {
    if (threadEmails.length > 0) {
      const newestEmail = threadEmails[threadEmails.length - 1]
      setExpandedEmails(new Set([newestEmail.id]))
    }
  }, [threadEmails])

  useEffect(() => {
    const unreadEmails = threadEmails.filter(
      (email: Email) => email.unread && !readOnceRef.current.has(email.id)
    )
    if (unreadEmails.length > 0) {
      unreadEmails.forEach((email: Email) => {
        markEmailAsRead(email.id)
        readOnceRef.current.add(email.id)
      })
    }
  }, [threadEmails, markEmailAsRead])

  if (!threadId) {
    return <div className="p-6">Invalid thread ID.</div>
  }

  if (threadEmails.length === 0) {
    return <div className="p-6">Thread not found.</div>
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleMove = (type: 'spam' | 'trash' | 'inbox') => {
    if (threadEmails.length === 0) return
    const action = type === 'spam' ? moveToSpam : type === 'trash' ? moveToTrash : moveToInbox
    action(threadEmails[0].threadId)
    navigate(-1)
  }

  const handleToggleStar = (emailId: string) => {
    toggleStar(emailId)
  }

  const toggleEmailExpansion = (emailId: string) => {
    setExpandedEmails((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(emailId)) {
        newSet.delete(emailId)
      } else {
        newSet.add(emailId)
      }
      return newSet
    })
  }

  const getAvatarColor = (name: string): string => {
    const colors = [
      '#ef4444',
      '#f97316',
      '#eab308',
      '#22c55e',
      '#06b6d4',
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#64748b',
      '#dc2626',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const subject = threadEmails[0]?.subject || 'No Subject'

  return (
    <div className="flex-1 bg-white flex flex-col overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="material-icons text-gray-600">arrow_back</span>
            </button>

            {isSpamThread && (
              <button
                onClick={() => handleMove('inbox')}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                <span className="material-icons text-sm">inbox</span>
                Not spam
              </button>
            )}

            {isTrashThread && (
              <button
                onClick={() => handleMove('inbox')}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                <span className="material-icons text-sm">inbox</span>
                Move to Inbox
              </button>
            )}
          </div>

          {!isSpamThread && !isTrashThread && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMove('spam')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Report spam"
              >
                <span className="material-icons text-gray-600">report</span>
              </button>
              <button
                onClick={() => handleMove('trash')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Delete"
              >
                <span className="material-icons text-gray-600">delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-4">
        <h1 className="text-2xl font-normal text-gray-900">{subject}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {threadEmails.map((email, index) => {
          const isExpanded = expandedEmails.has(email.id)
          const isLast = index === threadEmails.length - 1

          return (
            <div key={email.id} className="mb-4 last:mb-0">
              {!isExpanded && (
                <div
                  onClick={() => toggleEmailExpansion(email.id)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                      style={{ backgroundColor: getAvatarColor(email.from.name) }}
                    >
                      {getInitials(email.from.name)}
                    </div>

                    {/* Sender and preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{email.from.name}</span>
                        <span className="text-gray-500 text-sm truncate">
                          {email.body.substring(0, 50)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Time and Star */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{formatFullDate(email.date)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleStar(email.id)
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
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
                </div>
              )}

              {isExpanded && (
                <div className="bg-white border border-gray-200 rounded-lg">
                  {/* Email Header */}
                  <div
                    onClick={() => !isLast && toggleEmailExpansion(email.id)}
                    className={`flex items-start justify-between p-6 border-b border-gray-100 ${
                      !isLast ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                        style={{ backgroundColor: getAvatarColor(email.from.name) }}
                      >
                        {getInitials(email.from.name)}
                      </div>

                      {/* Sender Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{email.from.name}</span>
                          <span className="text-gray-500 text-sm">&lt;{email.from.email}&gt;</span>
                        </div>
                        <div className="text-gray-500 text-sm">
                          to you
                          {index > 0 && threadEmails.length > 2 && <span>, {email.from.name}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Time and Star */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{formatFullDate(email.date)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleStar(email.id)
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
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
                  </div>

                  {/* Email Body */}
                  <div className="p-6">
                    <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                      {email.body}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
