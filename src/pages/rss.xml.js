import rss from '@astrojs/rss'
import { SITE } from '../site'
import { getPosts } from '../lib/posts'

export async function GET(context) {
  const posts = await getPosts()
  return rss({
    title: `${SITE.name} — Insights`,
    description: 'Product management, restaurant technology, and leadership.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}`,
    })),
  })
}
