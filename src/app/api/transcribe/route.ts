import { NextResponse, NextRequest } from 'next/server'

const transcribe = async () => {
  try {
    const response = await fetch(
      new Request('https://api.assemblyai.com/v2/realtime/token', {
        method: 'POST',
        headers: {
          authorization: process.env.ASSEMBLY_TOKEN,
        },
        body: JSON.stringify({ expires_in: 3600 }),
      })
    )
    const data = response
    NextResponse.json({ data, status: 200 })
  } catch (error) {
    NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
