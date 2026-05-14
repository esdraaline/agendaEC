import { redirect } from 'next/navigation'

interface Props {
  searchParams: { title?: string; text?: string; url?: string }
}

export default function SharePage({ searchParams }: Props) {
  const combined = [searchParams.title, searchParams.text, searchParams.url]
    .filter(Boolean)
    .join('\n')
  redirect(`/inbox?shared=${encodeURIComponent(combined)}`)
}
