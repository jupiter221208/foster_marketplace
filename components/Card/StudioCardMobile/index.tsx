import React, { useState } from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

const StudioHeroCardMobile = props => {
  const { data, change, value } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [profileLoaded, setProfileLoaded] = useState(false)
  const onClick = () => {}
  const [loaded, setLoaded] = useState(false)

  // const gotoAristPage = () => {
  //   dispatch({ type: 'set', isLoading: true })
  //   router.push(`/${data.artist_username}`)
  // }

  // const gotoNftDetailPage = () => {
  //   dispatch({ type: 'set', isLoading: true })
  //   router.push(`/nft/${data.token_id}`)
  // }

  return (
    <div className={styles.container}>
      <div className={styles.imageBG}></div>
      <div className={styles.mobileImageArea}>
        <div className={styles.imageArea}>
          <div className={styles.imageContent}>
            {!loaded && (
              <div className="w-full h-full">
                <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                  <div></div>
                </ReactPlaceholder>
              </div>
            )}
            <img
              src={data['asset_url']}
              alt=""
              width={550}
              height={772}
              className={styles.mobileImageStatus}
              loading="lazy"
              onLoad={() => {
                setLoaded(true)
              }}
              onClick={() => {
                change(!value)
              }}
            />
            <div className="w-full flex flex-col items-center justify-center mt-[10px]">
              <div className="w-full flex flex-row justify-center">
                <p className="inline text-center items-center gap-2">
                  <span className={styles.mobileheroName}>{data['name']}</span>
                  <span className={styles.mobileheroType}>( {data['type']} )</span>
                </p>
              </div>
              <div className={styles.mobileheroPrice}>Starting at {data['start_price']}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default StudioHeroCardMobile
