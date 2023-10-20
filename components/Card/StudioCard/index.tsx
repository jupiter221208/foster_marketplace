import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'
import Link from 'next/link'

// custom functions
import { useViewport } from 'utils'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'
import StudioHeroList from 'assets/json/hero/hero-list.json'

const StudioCard = props => {
  const { data, change, value } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false)
  const onClick = () => {}

  // const gotoAristPage = () => {
  //   dispatch({ type: 'set', isLoading: true })
  //   router.push(`/${data.artist_username}`)
  // }

  // const gotoNftDetailPage = () => {
  //   dispatch({ type: 'set', isLoading: true })
  //   router.push(`/nft/${data.token_id}`)
  // }

  return (
    <div>
      {/* <div className={styles.container}> */}
      {/* <Link href={`${window.origin}/nft/${data.token_id}`} passHref> */}{' '}
      {/* <a>
        <div className={styles.imageArea}>

          <div className={styles.imageContent}> */}
      <div className="w-full">
        {!loaded && (
          <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
            <div></div>
          </ReactPlaceholder>
        )}
        <img
          src={data['asset_url']}
          alt=""
          className={styles.imageStatus}
          onLoad={() => {
            setLoaded(true)
          }}
          loading="lazy"
          onClick={() => {
            change(!value)
          }}
        />
        <div className="w-full flex flex-col items-center justify-center mt-[10px]">
          <div className="w-full flex flex-row justify-center">
            <div className={styles.heroName}>{data['name']}</div>
            <div className={styles.heroType}>( {data['type']} )</div>
          </div>
          <div className={styles.heroPrice}>Starting at {data['start_price']}</div>
        </div>
      </div>
      {/* </div>
        </div>
      </a> */}
      {/* </Link> */}
      <div className="absolute z-10 right-8 bottom-8 cursor-pointer">
        <div className="justify-start items-center lg:mt-[10px]">
          {data.artist_profile_picture &&
            data.artist_profile_picture !== '' &&
            data.artist_profile_picture !== undefined && (
              <div className={styles.avatar}>
                <img
                  src={data.artist_profile_picture}
                  alt=""
                  width={viewport === 'lg' ? 40 : 60}
                  height={viewport === 'lg' ? 40 : 60}
                  className="rounded-full"
                  loading="lazy"
                />
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default StudioCard
