import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { EmailList } from './components/EmailList'
import { ThreadView } from './components/ThreadView'

function App() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-white border-b border-gray-200 px-14 py-3 flex-shrink-0">
        <div className="flex items-center">
          <img src="/zmail-logo.png" alt="ZMail" className="h-8 w-auto" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden px-10">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden pl-6">
          <Routes>
            <Route path="/" element={<Navigate to="/inbox" replace />} />
            <Route path="/inbox" element={<EmailList />} />
            <Route path="/starred" element={<EmailList />} />
            <Route path="/spam" element={<EmailList />} />
            <Route path="/trash" element={<EmailList />} />
            <Route path="/all" element={<EmailList />} />
            <Route path="/thread/:threadId" element={<ThreadView />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
