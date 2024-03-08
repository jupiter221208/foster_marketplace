import React, { useCallback, useState } from 'react'

// styles
import styles from './index.module.scss'
import Image from 'next/image'

function shouldUseHeliusCdn(url: URL): boolean {
  let hostname = url.hostname
  if (hostname == 'cdn.helius-rpc.com') return false

  // return hostname.match(/^([^.]+.)?arweave\.net$/i)
  return true
}

function useHeliusCdn(urlString: string | null, options: Record<string, string | number> = {}): string | null {
  if (!urlString || !urlString.match(/^https?:\/\//i)) return null

  // unwrap cdn urls
  let url = new URL(urlString)
  while (url.hostname == 'cdn.helius-rpc.com' && url.pathname.startsWith('/cdn-cgi/image/')) {
    try {
      url = new URL(decodeURIComponent(url.pathname.match(/(?<=\/cdn-cgi\/image\/[^\/]*\/).*$/)[0]))
    } catch (e: any) {
      console.error(`could not decode url: ${url.toString()}, original: ${urlString}: ${e?.message}`)
      return null
    }
  }

  if (!shouldUseHeliusCdn(url)) return null

  let parameters = Object.entries(options)
    .filter(([, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => k + '=' + v.toString())
    .join(',')
  return `https://cdn.helius-rpc.com/cdn-cgi/image/${parameters}/${encodeURIComponent(url.toString())}`
}

export type ImageWithFosterProps = {
  src: string
  link?: string
  quality?: number
  originalSrc?: string | null
  showPlaceHolder?: boolean
  useNextImage?: boolean
  placeholder?: 'blur' | 'empty'
} & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

const ImageWithFoster = ({
  src,
  link = '',
  originalSrc = null,
  showPlaceHolder = true,

  quality = 50,
  width,
  height,

  onClick,
  onLoad,
  onError,
  useNextImage = false,
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

  const handleLoad = useCallback(
    e => {
      setLoaded(true)
      return onLoad?.(e)
    },
    [onLoad]
  )

  const handleError = useCallback(
    e => {
      let newIndex = currentSrcIndex + 1
      if (newIndex < srcUrls.length) setCurrentSrcIndex(newIndex)
      else return onError?.(e)
    },
    [srcUrls, currentSrcIndex, onError]
  )

  return (
    <div className="w-full h-full relative overflow-hidden" onClick={onClick}>
      <div className="w-full h-full flex justify-center items-center z-1000">
        {useNextImage || heliusUrl != srcUrls[currentSrcIndex] ? (
          <Image
            src={srcUrls[currentSrcIndex]}
            onLoad={handleLoad}
            loading="lazy"
            layout="fill"
            onError={handleError}
            {...rest}
          />
        ) : (
          <img {...rest} src={srcUrls[currentSrcIndex]} onLoad={handleLoad} loading="lazy" onError={handleError} />
        )}
      </div>
      <div className="w-full h-full absolute top-0 overflow-hidden" onClick={onClick}>
        <div
          className={`${styles.skeletonLoaderOuterBox} absolute z-50 top-0 transition-all ${
            loaded || !showPlaceHolder ? 'invisible' : 'visible'
          }`}
        >
          <div className={styles.skeletonLoader} />
        </div>
      </div>
    </div>
  )
}

export default ImageWithFoster
