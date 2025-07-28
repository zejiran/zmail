import { create } from 'zustand'
import { emails as initialEmails } from '../data/emails'
import type { Email } from '../types'
import { CONFIG } from '../utils/constants'

interface EmailStore {
  emails: Email[]
  markEmailAsRead: (id: string) => void
  toggleStar: (id: string) => void
  toggleThreadStar: (threadId: string, currentFolder?: string) => void
  moveToSpam: (threadId: string) => void
  moveToTrash: (threadId: string) => void
  moveToInbox: (threadId: string) => void
}

export const useEmailStore = create<EmailStore>((set) => ({
  emails: [...initialEmails],
  markEmailAsRead: (id) =>
    set((state) => ({
      emails: state.emails.map((e: Email) => (e.id === id ? { ...e, unread: false } : e)),
    })),
  toggleStar: (id) =>
    set((state) => ({
      emails: state.emails.map((e: Email) => (e.id === id ? { ...e, starred: !e.starred } : e)),
    })),
  toggleThreadStar: (threadId) =>
    set((state) => {
      const threadEmails = state.emails.filter((e: Email) => e.threadId === threadId)
      const hasStarredEmail = threadEmails.some((e: Email) => e.starred)

      if (hasStarredEmail) {
        // Unstar all emails in the thread
        return {
          emails: state.emails.map((e: Email) =>
            e.threadId === threadId ? { ...e, starred: false } : e
          ),
        }
      } else {
        // Star only the first email in the thread (chronologically)
        const sortedThreadEmails = threadEmails.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        const firstEmailId = sortedThreadEmails.length > 0 ? sortedThreadEmails[0].id : null

        if (firstEmailId) {
          return {
            emails: state.emails.map((e: Email) =>
              e.id === firstEmailId ? { ...e, starred: true } : e
            ),
          }
        }
      }

      return { emails: state.emails }
    }),
  moveToSpam: (threadId) =>
    set((state) => ({
      emails: state.emails.map((e: Email) =>
        e.threadId === threadId ? { ...e, isSpam: true, isTrash: false } : e
      ),
    })),
  moveToTrash: (threadId) =>
    set((state) => ({
      emails: state.emails.map((e: Email) =>
        e.threadId === threadId
          ? {
              ...e,
              isTrash: true,
              isSpam: false,
              starred: CONFIG.removeStarOnTrash ? false : e.starred,
            }
          : e
      ),
    })),
  moveToInbox: (threadId) =>
    set((state) => ({
      emails: state.emails.map((e: Email) =>
        e.threadId === threadId ? { ...e, isSpam: false, isTrash: false } : e
      ),
    })),
}))
