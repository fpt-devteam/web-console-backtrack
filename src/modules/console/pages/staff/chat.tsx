import { StaffLayout } from '../../components/staff/layout'
import { Search, Smile, Paperclip, Image as ImageIcon, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface Chat {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'date'
  statusText: string
  caseTitle: string
  caseNumber: string
  lastMessage: string
  timestamp: string
  unreadCount?: number
}

interface Message {
  id: string
  sender: 'customer' | 'staff'
  text: string
  timestamp: string
}

interface ChatWithMessages extends Chat {
  messages: Message[]
}

const mockChats: ChatWithMessages[] = [
  {
    id: '1',
    name: 'Alice Smith',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Smith&background=6366f1&color=fff',
    status: 'online',
    statusText: 'Online',
    caseTitle: 'Lost Wallet',
    caseNumber: '#4421',
    lastMessage: 'It is a brown leather wallet.',
    timestamp: '10:42 AM',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        text: "Hi, I think I left my wallet in the lobby near the coffee machine. Can you check?",
        timestamp: '10:30 AM',
      },
      {
        id: 'm2',
        sender: 'staff',
        text: "Hello Alice. I'm checking with the security team now. Can you describe the wallet?",
        timestamp: '10:32 AM',
      },
      {
        id: 'm3',
        sender: 'customer',
        text: 'It is a brown leather wallet. It has a small silver clasp on the front.',
        timestamp: '10:42 AM',
      },
    ],
  },
  {
    id: '2',
    name: 'Bob Jones',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Jones&background=10b981&color=fff',
    status: 'offline',
    statusText: 'Yesterday',
    caseTitle: 'Keys',
    caseNumber: '#9920',
    lastMessage: 'Has anyone turned in a set of keys?',
    timestamp: 'Yesterday',
    unreadCount: 1,
    messages: [
      {
        id: 'm4',
        sender: 'customer',
        text: 'Has anyone turned in a set of keys?',
        timestamp: 'Yesterday',
      },
    ],
  },
  {
    id: '3',
    name: 'Charlie Brown',
    avatar: 'https://ui-avatars.com/api/?name=Charlie+Brown&background=f59e0b&color=fff',
    status: 'date',
    statusText: 'Oct 24',
    caseTitle: 'Phone',
    caseNumber: '#1102',
    lastMessage: 'Thank you for finding it!',
    timestamp: 'Oct 24',
    messages: [
      {
        id: 'm5',
        sender: 'customer',
        text: 'Thank you for finding it!',
        timestamp: 'Oct 24',
      },
    ],
  },
]

export function StaffChatPage() {
  const [selectedChat, setSelectedChat] = useState<string>('1')
  const [filter, setFilter] = useState<'all' | 'unread' | 'resolved'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')

  const activeChat = mockChats.find((chat) => chat.id === selectedChat)
  const filteredChats = mockChats.filter((chat) => {
    if (filter === 'unread' && !chat.unreadCount) return false
    if (filter === 'resolved') return false // Add resolved logic later
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        chat.name.toLowerCase().includes(searchLower) ||
        chat.caseTitle.toLowerCase().includes(searchLower) ||
        chat.caseNumber.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message logic here
      setMessage('')
    }
  }

  return (
    <StaffLayout>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Left Pane - Chat List */}
        <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Chat</h2>
            
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-50 text-blue-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Chats
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'resolved'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                  selectedChat === chat.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {chat.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {chat.status === 'offline' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {chat.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">{chat.timestamp}</span>
                    </div>
                    <div className={`text-sm font-medium mb-1 ${
                      selectedChat === chat.id ? 'text-blue-500' : 'text-gray-500'
                    }`}>
                      Case {chat.caseNumber}: {chat.caseTitle}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm truncate">{chat.lastMessage}</p>
                      {chat.unreadCount && (
                        <span className="ml-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane - Active Chat */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeChat.avatar}
                      alt={activeChat.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {activeChat.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {activeChat.status === 'offline' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{activeChat.name}</h3>
                    </div>
                    <p className="text-sm text-blue-500">
                      Case {activeChat.caseNumber}: {activeChat.caseTitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Resolved
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 px-7 space-y-4 bg-gray-50">
                <div className="text-center">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    TODAY
                  </span>
                </div>

                {activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        msg.sender === 'staff'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      } rounded-lg px-4 py-2`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === 'staff' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1 px-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  )
}
