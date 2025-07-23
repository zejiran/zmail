import { useParams, useNavigate } from 'react-router-dom'
import { useEmailStore } from '../store/emailStore'
import { useEffect, useMemo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { Email } from '../types'

export function ThreadView() {
  const readOnceRef = useRef<Set<string>>(new Set())
  const { threadId } = useParams<{ threadId: string }>()
  const navigate = useNavigate()

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
    () => emails.filter((e: Email) => e.threadId === threadId),
    [emails, threadId]
  )

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
    return <div className="p-4">Invalid thread ID.</div>
  }

  if (threadEmails.length === 0) {
    return <div className="p-4">Thread not found.</div>
  }

  const handleMove = (type: 'spam' | 'trash' | 'inbox') => {
    if (threadEmails.length === 0) return
    const action = type === 'spam' ? moveToSpam : type === 'trash' ? moveToTrash : moveToInbox
    action(threadEmails[0].threadId)
    navigate(-1)
  }

  return (
    <div className="p-4 space-y-4">
      {threadEmails.map((email: Email) => (
        <div key={email.id} className="border rounded p-4 shadow-sm bg-white">
          <div className="flex justify-between text-sm text-gray-500">
            <div>
              <span className="font-semibold text-black">{email.from.name}</span> &lt;
              {email.from.email}&gt;
            </div>
            <div>{new Date(email.date).toLocaleString()}</div>
          </div>
          <div className="font-bold">{email.subject}</div>
          <div className="mt-2 whitespace-pre-wrap text-sm">{email.body}</div>
          <div className="mt-2 flex gap-2 text-xs">
            <button onClick={() => toggleStar(email.id)} className="text-blue-500 hover:underline">
              {email.starred ? 'Unstar' : 'Star'}
            </button>
          </div>
        </div>
      ))}

      <div className="mt-4 flex gap-4">
        <button
          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded"
          onClick={() => handleMove('spam')}
        >
          Move to Spam
        </button>
        <button
          className="px-3 py-1 bg-red-100 text-red-800 rounded"
          onClick={() => handleMove('trash')}
        >
          Move to Trash
        </button>
        <button
          className="px-3 py-1 bg-gray-100 text-gray-800 rounded"
          onClick={() => handleMove('inbox')}
        >
          Move to Inbox
        </button>
      </div>
    </div>
  )
}
