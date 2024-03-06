import Link from 'next/link'
import React, { useState } from 'react'

// styles
import styles from './index.module.scss'

function useHeliusCdn(urlString: string | null, options: Record<string, string | number> = {}): string | null {
  if (!urlString || !urlString.match(/^https?:\/\//i)) return null
  // only optimize arweave.com urls
  const url = new URL(urlString)
  if (!url.hostname.match(/^([^.]+.)?arweave\.net$/i)) return null

  let parameters = Object.entries(options)
    .filter(([, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => k + '=' + v.toString())
    .join(',')
  return `https://cdn.helius-rpc.com/cdn-cgi/image/${parameters}/${encodeURIComponent(urlString)}`
}

export type ImageWithFosterProps = {
  src: string
  link?: string
  quality?: number
  originalSrc?: string | null
  showPlaceHolder?: boolean
} & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

const ImageWithFoster = ({
  src,
  link = '',
  originalSrc = null,
  showPlaceHolder = true,

  quality = 75,
  width,
  height,

  onClick,
  onLoad,
  onError,
  ...rest
}: ImageWithFosterProps) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const heliusUrl = useHeliusCdn(src, {
    quality,
    width,
    height,
  })
  const srcUrls = [heliusUrl, src, originalSrc].filter(url => url)
  const [currentSrcIndex, setCurrentSrcIndex] = useState<number>(0)

  function handleError(e) {
    let newIndex = currentSrcIndex + 1
    if (newIndex < srcUrls.length) setCurrentSrcIndex(newIndex)
    else return onError?.(e)
  }

  return (
    <div className="w-full h-full" onClick={onClick}>
      {showPlaceHolder && !loaded && (
        <div className={styles.skeletonLoaderOuterBox}>
          <div className={styles.skeletonLoader} />
        </div>
      )}
      <div className="w-full h-full flex justify-center items-center">
        <img
          {...rest}
          src={srcUrls[currentSrcIndex]}
          onLoad={e => {
            setLoaded(true)
            return onLoad?.(e)
          }}
          loading="lazy"
          onError={handleError}
        />
      </div>
    </div>
  )
}

export default ImageWithFoster
