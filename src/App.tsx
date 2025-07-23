import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { EmailList } from './components/EmailList'
import { ThreadView } from './components/ThreadView'

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
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
  )
}

export default App
