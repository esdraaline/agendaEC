import LoginForm from '@/components/features/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">AgendaEC</h1>
        <p className="mb-8 text-sm text-gray-500">Loja de cosméticos</p>
        <LoginForm />
      </div>
    </main>
  )
}
