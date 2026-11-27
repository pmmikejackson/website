// Site-wide facts. Edit here; every page reads from this file.
export const SITE = {
  name: 'Mike Jackson',
  title: 'Mike Jackson — Product Leader',
  role: 'Product Manager & Technology Leader',
  description:
    'Product manager and technology leader with 20+ years transforming restaurant operations through enterprise-scale deployments, team development, and hands-on prototyping.',
  email: 'mike@mikejacksonpm.com',
  linkedin: 'https://www.linkedin.com/in/michael-c-jackson01/',
  github: 'https://github.com/pmmikejackson',
  resume: '/files/mike-jackson-resume.pdf',
  location: 'Rockwall, Texas',
  bio: 'Product leader with 20+ years in restaurant technology, writing about how product work is changing with AI.',
}

export const NAV = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/blog', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
]

export const CATEGORIES: Record<string, string> = {
  'product-management': 'Product Management',
  'restaurant-tech': 'Restaurant Tech',
  leadership: 'Leadership',
}

export const STATS = [
  { value: '20+', label: 'Years in restaurant technology' },
  { value: '20,000+', label: 'Production deployments managed' },
  { value: '99%', label: 'Support center improvement' },
  { value: '15', label: 'PMs trained to Pragmatic Level IV' },
]

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}
