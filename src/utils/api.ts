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
