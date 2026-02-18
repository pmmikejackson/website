const STRAPI_URL = 'https://cms.themikejackson.com'

async function fetchAPI(path) {
  const res = await fetch(`${STRAPI_URL}/api${path}`)
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`)
  return res.json()
}

export function getStrapiMedia(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${STRAPI_URL}${url}`
}

export async function getPosts() {
  const data = await fetchAPI('/blog-posts?sort=PublishedDate:desc&populate=*')
  return data.data ?? []
}

export async function getPost(slug) {
  const data = await fetchAPI(`/blog-posts?filters[Slug][$eq]=${slug}&populate=*`)
  return data.data?.[0] ?? null
}

export async function getPages() {
  const data = await fetchAPI('/pages?populate=*')
  return data.data ?? []
}

export async function getPage(slug) {
  const data = await fetchAPI(`/pages?filters[Slug][$eq]=${slug}&populate=*`)
  return data.data?.[0] ?? null
}

export async function getTeamMembers() {
  const data = await fetchAPI('/team-members?populate=*')
  return data.data ?? []
}
