import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ContactFormProps {
  isActive: boolean
}

export default function ContactForm({ isActive }: ContactFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('https://functions.poehali.dev/da190dda-e540-48e8-80f3-a0bf13d2331e', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message })
      })
      if (res.ok) {
        setStatus('success')
        setName('')
        setPhone('')
        setMessage('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mt-10 flex flex-col gap-4 max-w-md"
      initial={{ opacity: 0, y: 30 }}
      animate={isActive ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Input
        placeholder="Ваше имя"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="bg-white/10 border-white/20 text-white placeholder:text-neutral-500 focus:border-amber-400"
      />
      <Input
        placeholder="Телефон"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        required
        type="tel"
        className="bg-white/10 border-white/20 text-white placeholder:text-neutral-500 focus:border-amber-400"
      />
      <Textarea
        placeholder="Что вас интересует? (необязательно)"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={3}
        className="bg-white/10 border-white/20 text-white placeholder:text-neutral-500 focus:border-amber-400 resize-none"
      />
      {status === 'success' ? (
        <p className="text-amber-400 font-medium">Заявка отправлена! Мы свяжемся с вами в ближайшее время.</p>
      ) : (
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="bg-amber-400 text-black hover:bg-amber-300 font-semibold text-base py-6"
        >
          {status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
        </Button>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm">Не удалось отправить. Попробуйте ещё раз.</p>
      )}
    </motion.form>
  )
}