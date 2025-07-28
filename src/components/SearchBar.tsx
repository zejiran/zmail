import { useState, useEffect } from 'react'
import { useEmailStore } from '../store/emailStore'

interface SearchBarProps {
  className?: string
}

export const SearchBar = ({ className = '' }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { setSearchQuery: setStoreSearchQuery, clearSearch } = useEmailStore()

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        setStoreSearchQuery(searchQuery.trim())
      } else {
        clearSearch()
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, setStoreSearchQuery, clearSearch])

  const handleClear = () => {
    setSearchQuery('')
    clearSearch()
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
          search
        </span>
        <input
          type="text"
          placeholder="Search mail"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="material-icons text-lg">close</span>
          </button>
        )}
      </div>
    </div>
  )
}
