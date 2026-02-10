'use client'

import React, { useState } from 'react'
import { Button, Input, Card } from '@/components/ui'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary-50 mb-10 text-center">
          Nous Contacter
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          {[
            {
              icon: Phone,
              title: 'Téléphone',
              value: '+212 6 12 34 56 78',
              link: 'tel:+212612345678',
            },
            {
              icon: Mail,
              title: 'Email',
              value: 'contact@knitandcraft.com',
              link: 'mailto:contact@knitandcraft.com',
            },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <Card
                key={index}
                className="p-6 flex items-center gap-4 bg-primary-900/70 border-primary-800 text-primary-50"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-accent-300" />
                </div>
                <div>
                  <p className="text-sm text-accent-100/80">{item.title}</p>
                  <a
                    href={item.link}
                    className="text-lg font-semibold text-primary-50 hover:text-accent-300"
                  >
                    {item.value}
                  </a>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Contact Form */}
        <Card className="p-8 bg-primary-900/70 backdrop-blur-md border border-primary-800">
          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-400/60 rounded-lg">
              <p className="text-emerald-100">
                ✓ Message envoyé avec succès. Nous vous recontacterons bientôt!
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nom"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-transparent border-primary-700 text-white placeholder:text-white/50"
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-transparent border-primary-700 text-white placeholder:text-white/50"
              />
            </div>

            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-transparent border-primary-700 text-white placeholder:text-white/50"
            />

            <Input
              label="Sujet"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="bg-transparent border-primary-700 text-white placeholder:text-white/50"
            />

            <div>
              <label className="block text-sm font-medium text-primary-50 mb-1.5">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2.5 bg-transparent border-2 border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400 resize-none text-primary-50 placeholder:text-primary-100/50"
                required
              />
            </div>

            <Button type="submit" size="lg" isLoading={loading} className="w-full">
              Envoyer le message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
