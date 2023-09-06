const createURL = (path: string): string => {
  return window.location.origin + path
}

export const createNewScript = async () => {
  const res = await fetch(
    new Request(createURL('/api/script'), {
      method: 'POST',
    })
  )

  if (res.ok) {
    const data = await res.json()
    return data.data
  }
}

export const updateScript = async (data: {
  title?: string
  audience?: string
  content?: string
  id: string
}) => {
  const res = await fetch(
    new Request(createURL('/api/script'), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  )

  if (res.ok) {
    const data = await res.json()
    return data.data
  }
}

export const fetchBadges = async () => {
  const res = await fetch(
    new Request(createURL('/api/badges'), {
      method: 'GET',
    })
  )

  if (res.ok) {
    const data = await res.json()
    return data.data
  }
}
