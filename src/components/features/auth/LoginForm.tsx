'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/hoje`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center">
        <p className="text-sm font-medium text-green-800">Link enviado!</p>
        <p className="mt-1 text-sm text-green-600">Verifique seu email e clique no link para entrar.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        autoFocus
        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="w-full rounded-xl bg-violet-600 py-3 text-base font-semibold text-white disabled:opacity-40 active:scale-[0.98] transition-transform"
      >
        {loading ? 'Enviando...' : 'Receber link de acesso'}
      </button>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </form>
  )
}
