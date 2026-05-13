import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const text = formData.get('text')?.toString() ?? ''
  const title = formData.get('title')?.toString() ?? ''
  const url = formData.get('url')?.toString() ?? ''

  const combined = [title, text, url].filter(Boolean).join('\n')
  const encoded = encodeURIComponent(combined)

  return NextResponse.redirect(
    new URL(`/inbox?shared=${encoded}`, request.url)
  )
}
