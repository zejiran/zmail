import type { Email } from "../types"

export const emails: Email[] = [
  {
    id: "1",
    threadId: "thread_1",
    subject: "Welcome to BMail",
    from: {
      name: "BMail Team",
      email: "noreply@bmail.com"
    },
    body: "Welcome to BMail! Your account is all set up and ready to go. Start exploring our features.",
    date: "2030-03-14T09:15:00-05:00",
    unread: false,
    starred: true,
    isSpam: false,
    isTrash: false
  },
  {
    id: "2",
    threadId: "thread_2",
    subject: "Project deadline reminder",
    from: {
      name: "Lisa Wang",
      email: "lisa.wang@company.com"
    },
    body: "Hi team, just a reminder that our project deadline is this Friday. Please submit your final reports.",
    date: "2030-03-13T14:30:00-05:00",
    unread: true,
    starred: false,
    isSpam: false,
    isTrash: false
  },
  {
    id: "3",
    threadId: "thread_2",
    subject: "Re: Project deadline reminder",
    from: {
      name: "David Kim",
      email: "david.kim@company.com"
    },
    body: "Thanks Lisa! I'll have my section ready by Thursday afternoon.",
    date: "2030-03-13T16:20:00-05:00",
    unread: true,
    starred: false,
    isSpam: false,
    isTrash: false
  },
  {
    id: "4",
    threadId: "thread_3",
    subject: "Coffee catch-up?",
    from: {
      name: "Emma Thompson",
      email: "emma.t@gmail.com"
    },
    body: "Hey! It's been a while. Want to grab coffee this week and catch up?",
    date: "2030-03-12T11:45:00-05:00",
    unread: false,
    starred: false,
    isSpam: false,
    isTrash: false
  },
  {
    id: "5",
    threadId: "thread_4",
    subject: "Your subscription is expiring",
    from: {
      name: "StreamingService",
      email: "billing@streamingservice.com"
    },
    body: "Your monthly subscription will expire in 3 days. Renew now to continue enjoying our content.",
    date: "2030-03-12T19:00:00-05:00",
    unread: false,
    starred: false,
    isSpam: false,
    isTrash: false
  },
  {
    id: "6",
    threadId: "thread_5",
    subject: "Weekend hiking trip",
    from: {
      name: "Outdoor Club",
      email: "info@outdoorclub.org"
    },
    body: "Join us this Saturday for a scenic hike at Blue Mountain Trail. All skill levels welcome!",
    date: "2030-03-12T16:30:00-05:00",
    unread: true,
    starred: true,
    isSpam: false,
    isTrash: false
  },
  {
    id: "7",
    threadId: "thread_6",
    subject: "Important: Security update",
    from: {
      name: "IT Department",
      email: "it@company.com"
    },
    body: "Please update your password before the end of the week as part of our security policy.",
    date: "2030-03-12T10:00:00-05:00",
    unread: false,
    starred: false,
    isSpam: false,
    isTrash: false
  },
  {
    id: "8",
    threadId: "thread_7",
    subject: "Free iPhone 15 - Act Now!",
    from: {
      name: "Deals4U",
      email: "no-reply@deals4u.biz"
    },
    body: "You've been selected to receive a FREE iPhone 15! Just pay shipping. Limited time offer!!!",
    date: "2030-03-12T22:15:00-05:00",
    unread: true,
    starred: false,
    isSpam: true,
    isTrash: false
  },
  {
    id: "9",
    threadId: "thread_8",
    subject: "Monthly newsletter",
    from: {
      name: "Local Library",
      email: "newsletter@library.org"
    },
    body: "Check out our new arrivals and upcoming events this month at your local library.",
    date: "2030-03-13T09:00:00-05:00",
    unread: false,
    starred: false,
    isSpam: false,
    isTrash: false
  },
  {
    id: "10",
    threadId: "thread_9",
    subject: "Re: Lunch tomorrow?",
    from: {
      name: "You",
      email: "you@gmail.com"
    },
    body: "Sure! How about that new sushi place on Main Street?",
    date: "2030-03-12T15:14:00-05:00",
    unread: false,
    starred: false,
    isSpam: false,
    isTrash: true
  }
]
