const endpoint = 'https://raw.githubusercontent.com'

export const scrape = async (url: string) => {
  let path = url.split('.com')[1]
  path = path.replace('blob/', '')
  console.log('url: ', `${endpoint}${path}`)
  const res = await fetch(`${endpoint}${path}`)

  if (res.ok) {
    const data = await res.json()
    return data
  }
}
