import { getServerSideSitemap } from 'next-sitemap'
import { getBlog } from '../lib/squidex'

export const getServerSideProps = async ctx => {
  // Method to source urls from backend
  let staticUrlList = ['/', '/en']

  const staticFields = staticUrlList.map(url => ({
    loc: `https://fostermarketplace.app${url}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.7',
  }))

  const staticFieldsWeekly = staticUrlList.map(url => ({
    loc: `https://fostermarketplace.app${url}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.8',
  }))

  const allFields = [...staticFields, ...staticFieldsWeekly]
  return getServerSideSitemap(ctx, allFields)
}

// Default export to prevent next.js errors
export default getServerSideProps
