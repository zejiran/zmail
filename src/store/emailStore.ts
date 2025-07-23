import { create } from "zustand"
import { emails as initialEmails } from "../data/emails"
import type { Email } from "../types"
import { CONFIG } from "../utils/constants"

interface EmailStore {
  emails: Email[]
  markEmailAsRead: (id: string) => void
  toggleStar: (id: string) => void
  moveToSpam: (threadId: string) => void
  moveToTrash: (threadId: string) => void
  moveToInbox: (threadId: string) => void
}

export const useEmailStore = create<EmailStore>((set) => ({
  emails: [...initialEmails],
  markEmailAsRead: (id) =>
    set((state) => ({
      emails: state.emails.map((e) =>
        e.id === id ? { ...e, unread: false } : e
      ),
    })),
  toggleStar: (id) =>
    set((state) => ({
      emails: state.emails.map((e) =>
        e.id === id ? { ...e, starred: !e.starred } : e
      ),
    })),
  moveToSpam: (threadId) =>
    set((state) => ({
      emails: state.emails.map((e) =>
        e.threadId === threadId
          ? { ...e, isSpam: true, isTrash: false }
          : e
      ),
    })),
  moveToTrash: (threadId) =>
    set((state) => ({
      emails: state.emails.map((e) =>
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
      emails: state.emails.map((e) =>
        e.threadId === threadId ? { ...e, isSpam: false, isTrash: false } : e
      ),
    })),
}))
