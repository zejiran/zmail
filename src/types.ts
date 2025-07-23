export interface Email {
  id: string
  threadId: string
  subject: string
  from: {
    name: string
    email: string
  }
  body: string
  date: string
  unread: boolean
  starred: boolean
  isSpam: boolean
  isTrash: boolean
}
