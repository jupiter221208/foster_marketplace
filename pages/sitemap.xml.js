import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async ctx => {
  // Method to source urls from backend
  let staticUrlList = ['/', '/explore', '/resources', '/stats', '/dao']

  const staticFieldsWeekly = staticUrlList.map(url => ({
    loc: `https://fostermarketplace.app${url}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.8',
  }))

  const allFields = [...staticFieldsWeekly]
  return getServerSideSitemap(ctx, allFields)
}

// Default export to prevent next.js errors
export default getServerSideProps
