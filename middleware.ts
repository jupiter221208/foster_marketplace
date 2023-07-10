import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = new URL(req.nextUrl)
  let path = url.pathname

  if (path.match(/^\/browse-nft\/?/) && url.searchParams.has('id')) {
    let id = url.searchParams.get('id')
    url.searchParams.delete('id')
    url.pathname = `/nft/${id}`
    return NextResponse.redirect(url)
  } else if (path.match(/^\/browse-collection\/.+/)) {
    url.pathname = path.replace(/^\/browse-collection/, '/collection')
    return NextResponse.redirect(url, 308)
  }
}
