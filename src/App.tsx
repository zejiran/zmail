import { Routes, Route, Navigate } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"

function Placeholder({ title }: { title: string }) {
  return <div className="p-4 text-lg">{title} (todo)</div>
}

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/inbox" replace />} />
          <Route path="/inbox" element={<Placeholder title="Inbox" />} />
          <Route path="/starred" element={<Placeholder title="Starred" />} />
          <Route path="/spam" element={<Placeholder title="Spam" />} />
          <Route path="/trash" element={<Placeholder title="Trash" />} />
          <Route path="/all" element={<Placeholder title="All Mail" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
