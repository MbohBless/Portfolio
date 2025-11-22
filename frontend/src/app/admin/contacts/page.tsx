'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { getContacts, markAsRead, markAsUnread, deleteContact } from '@/app/actions/contacts'

interface Contact {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: Date
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    setIsLoading(true)
    const result = await getContacts()
    if (result.success && result.data) {
      setContacts(result.data)
    }
    setIsLoading(false)
  }

  const handleMarkAsRead = async (id: string) => {
    const result = await markAsRead(id)
    if (result.success) {
      await loadContacts()
      if (selectedContact?.id === id) {
        setSelectedContact(prev => prev ? { ...prev, read: true } : null)
      }
    }
  }

  const handleMarkAsUnread = async (id: string) => {
    const result = await markAsUnread(id)
    if (result.success) {
      await loadContacts()
      if (selectedContact?.id === id) {
        setSelectedContact(prev => prev ? { ...prev, read: false } : null)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    const result = await deleteContact(id)
    if (result.success) {
      await loadContacts()
      if (selectedContact?.id === id) {
        setSelectedContact(null)
      }
    }
  }

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'unread') return !contact.read
    if (filter === 'read') return contact.read
    return true
  })

  const unreadCount = contacts.filter(c => !c.read).length

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading contact messages...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold">Contact Messages</h1>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        <p className="text-gray-600">View and manage contact form submissions</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({contacts.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'read'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Read ({contacts.length - unreadCount})
        </button>
      </div>

      {filteredContacts.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-center text-gray-600 py-8">
              No contact messages yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Messages List */}
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <Card
                key={contact.id}
                className={`cursor-pointer transition-all ${
                  selectedContact?.id === contact.id
                    ? 'ring-2 ring-black'
                    : 'hover:shadow-lg'
                } ${!contact.read ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                onClick={() => {
                  setSelectedContact(contact)
                  if (!contact.read) {
                    handleMarkAsRead(contact.id)
                  }
                }}
              >
                <CardContent>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{contact.name}</h3>
                        {!contact.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {contact.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:sticky lg:top-6 h-fit">
            {selectedContact ? (
              <Card>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">
                          {selectedContact.name}
                        </h2>
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedContact.email}
                        </a>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {new Date(selectedContact.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(selectedContact.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded mb-6">
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={`mailto:${selectedContact.email}?subject=Re: Contact Form Message`}
                        className="flex-1"
                      >
                        <Button variant="primary" className="w-full">
                          Reply via Email
                        </Button>
                      </a>
                      {selectedContact.read ? (
                        <Button
                          variant="ghost"
                          onClick={() => handleMarkAsUnread(selectedContact.id)}
                        >
                          Mark Unread
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={() => handleMarkAsRead(selectedContact.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(selectedContact.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <p className="text-center text-gray-600 py-12">
                    Select a message to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
