import { create } from 'zustand'
import { emails as initialEmails } from '../data/emails'
import type { Email } from '../types'
import { CONFIG } from '../utils/constants'

interface EmailStore {
  emails: Email[]
  searchQuery: string
  markEmailAsRead: (id: string) => void
  toggleStar: (id: string) => void
  toggleThreadStar: (threadId: string, currentFolder?: string) => void
  moveToSpam: (threadId: string) => void
  moveToTrash: (threadId: string) => void
  moveToInbox: (threadId: string) => void
  setSearchQuery: (query: string) => void
  clearSearch: () => void
  getFilteredEmails: (folder: string) => Email[]
}

export const useEmailStore = create<EmailStore>((set, get) => ({
  emails: [...initialEmails],
  searchQuery: '',
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
  setSearchQuery: (query) =>
    set(() => ({
      searchQuery: query,
    })),
  clearSearch: () =>
    set(() => ({
      searchQuery: '',
    })),
  getFilteredEmails: (folder) => {
    const { emails, searchQuery } = get()

    // First filter by folder
    let filteredEmails = emails.filter((email) => {
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
    })

    // Then filter by search query if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filteredEmails = filteredEmails.filter((email) => {
        return (
          email.subject.toLowerCase().includes(query) ||
          email.body.toLowerCase().includes(query) ||
          email.from.name.toLowerCase().includes(query) ||
          email.from.email.toLowerCase().includes(query)
        )
      })
    }

    return filteredEmails
  },
}))
