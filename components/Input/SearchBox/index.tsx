import React, { useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// custom components
import OutlineButton from 'components/Button/OutlineButton'

// custom functions
import { useViewport } from 'utils'

// import images and icons
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import DefaultNftBG from 'assets/images/default-nft-bg.png'

// styles
import styles from './index.module.scss'
import { getDisplayUserName } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'

const SearchBox = props => {
  const { value, placeholder, onChange, searchList, onClick, onClose } = props
  const viewport = useViewport()
  const router = useRouter()
  const [focus, setFocus] = useState(false)

  return (
    <div className={`${styles.container} ${focus ? styles.borderLine : ''}`}>
      <div className={styles.searchArea}>
        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div className={styles.iconArea} onClick={() => onClick()}>
            {value !== '' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '12' : '16'}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '12' : '16'}
                viewBox="0 0 8.635 8.634"
              >
                <path
                  id="times-7"
                  d="M11.326,10.312c0-1.542,3.091-3.084,3.091-3.084A.722.722,0,1,0,13.4,6.207L10.312,9.3,7.228,6.207A.722.722,0,1,0,6.207,7.228l2.508,2.5.583.582L6.207,13.4a.722.722,0,1,0,1.021,1.021l3.084-3.091L13.4,14.417A.722.722,0,1,0,14.417,13.4S11.326,11.854,11.326,10.312Z"
                  transform="translate(-5.994 -5.996)"
                  fill="var(--text-gray-200-color)"
                  opacity="0.6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '12' : '16'}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '12' : '16'}
                viewBox="0 0 22.017 22"
              >
                <path
                  id="search-32"
                  d="M23.687,22.124,19.6,18.076A9.9,9.9,0,1,0,18.076,19.6l4.049,4.049a1.093,1.093,0,1,0,1.562-1.529ZM11.9,19.6a7.7,7.7,0,1,1,7.7-7.7,7.7,7.7,0,0,1-7.7,7.7Z"
                  transform="translate(-1.979 -1.979)"
                  fill="var(--text-gray-200-color)"
                />
              </svg>
            )}
          </div>
        ) : (
          <div className={styles.iconArea} onClick={() => onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 22.017 22" opacity={1}>
              <path
                id="search-32"
                d="M23.687,22.124,19.6,18.076A9.9,9.9,0,1,0,18.076,19.6l4.049,4.049a1.093,1.093,0,1,0,1.562-1.529ZM11.9,19.6a7.7,7.7,0,1,1,7.7-7.7,7.7,7.7,0,0,1-7.7,7.7Z"
                transform="translate(-1.979 -1.979)"
                fill="var(--text-gray-200-color)"
              />
            </svg>
          </div>
        )}

        <input
          className={styles.inputArea}
          value={value}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onChange={event => onChange(event.target.value)}
        />
      </div>

      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <div>
          <OutlineButton
            label="Cancel"
            onClick={() => {
              setFocus(false)
              onClose()
            }}
            backgroundColor="transparent"
            borderColor="transparent"
            color={'var(--text-gray-200-color)'}
          />
        </div>
      ) : focus ? (
        <div>
          <OutlineButton
            label="Cancel"
            onClick={() => {
              setFocus(false)
              onClose()
            }}
            fontSize={16}
            width={60}
            fontFamily="Muli-Regular"
            color={'var(--text-gray-200-color)'}
            backgroundColor="transparent"
            borderColor="transparent"
          />
        </div>
      ) : (
        <></>
      )}
      <div className="absolute top-[80px] w-full h-[1px] left-0 bg-[#707070]/50 z-10 flex lg:hidden" />

      {searchList.nfts.length === 0 && searchList.artists.length === 0 && searchList.collections.length === 0 ? (
        value?.length > 0 ? (
          <div className={styles.contentArea}>
            <div className="flex flex-wrap gap-[25px] px-[16px] py-[10px]">
              <div>
                <div className={styles.searchTopic}>ARTWORKS</div>
                <div className="w-[230px] flex gap-[10px] mt-[20px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-[36px] h-[36px] lg:w-[176px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
                <div className="w-[230px] flex gap-[10px] mt-[15px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-[36px] h-[36px] lg:w-[176px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
                <div className="w-[230px] flex gap-[10px] mt-[15px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-[36px] h-[36px] lg:w-[176px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
                <div className="w-[230px] flex gap-[10px] mt-[15px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-36px] h-[36px] lg:w-[176px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.searchTopic}>USERS</div>
                <div className="w-[220px] flex gap-[10px] mt-[20px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[22px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-[171px] h-[36px] lg:w-[171px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
                <div className="w-[220px] flex gap-[10px] mt-[15px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[22px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-[171px] h-[36px] lg:w-[171px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
                <div className="w-[220px] flex gap-[10px] mt-[15px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[22px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-[171px] h-[36px] lg:w-[171px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
                <div className="w-[220px] flex gap-[10px] mt-[15px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[22px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-[171px] h-[36px] lg:w-[171px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.searchTopic}>COLLECTIONS</div>
                <div className="w-[220px] flex gap-[10px] mt-[20px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-[171px] h-[36px] lg:w-[171px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
                <div className="w-[220px] flex gap-[10px] mt-[15px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-[171px] h-[36px] lg:w-[171px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
                <div className="w-[220px] flex gap-[10px] mt-[15px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-[171px] h-[36px] lg:w-[171px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
                <div className="w-[220px] flex gap-[10px] mt-[15px]">
                  <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                  <div className="w-[171px] h-[36px] lg:w-[171px] lg:h-[44px] rounded-[5px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null
      ) : (
        <div className={styles.contentArea}>
          <div className="w-full flex flex-wrap gap-[20px] mx-[15px] my-[10px]">
            <div className="w-[230px]">
              {searchList.nfts.length !== 0 && <div className={`${styles.searchTopic} mb-[18px]`}>ARTWORKS</div>}
              <div className="w-full flex flex-wrap">
                {searchList.nfts.map((item, index) => (
                  <div
                    key={index}
                    className={styles.selection}
                    onClick={() => {
                      router.push(`/nft/${item.id}`)
                      setFocus(false)
                      onClose()
                    }}
                  >
                    <div className="w-[36px] lg:w-[44px] h-[36px] lg:h-[44px] mr-[15px] overflow-hidden rounded-[10px]">
                      {item.image_url !== null && item.image_url !== '' ? (
                        <ImageWithFoster src={item.image_url} width={50} className="object-cover w-full h-full" />
                      ) : (
                        <Image src={DefaultNftBG} alt="" className="w-full h-full object-cover " />
                      )}
                    </div>
                    <div>
                      <div className={styles.text}>{item.name}</div>
                      <div className={styles.username}>{getDisplayUserName(item.artist_name)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[220px]">
              {searchList.artists.length !== 0 && <div className={`${styles.searchTopic} mb-[18px]`}>USERS</div>}
              <div className="w-full flex flex-wrap gap-[9px]">
                {searchList.artists.map((item, index) => (
                  <div
                    key={index}
                    className={styles.selection}
                    onClick={() => {
                      router.push(`/${item.name}`)
                      setFocus(false)
                      onClose()
                    }}
                  >
                    <div className="w-[36px] h-[36px] lg:w-[44px] lg:h-[44px] mr-5">
                      {item.image_url.length > 0 ? (
                        <ImageWithFoster
                          width={50}
                          src={item.image_url}
                          className="object-cover rounded-full w-full h-full"
                        />
                      ) : (
                        <Image
                          src={DefaultAvatar}
                          alt=""
                          width={35}
                          height={35}
                          layout="responsive"
                          objectFit="cover"
                          className="rounded-full"
                        />
                      )}
                    </div>
                    <div className={styles.text}>{getDisplayUserName(item.name)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[220px]">
              {searchList.collections.length !== 0 && (
                <div className={`${styles.searchTopic} mb-[18px]`}>COLLECTIONS</div>
              )}
              <div className="w-full flex flex-wrap gap-[9px]">
                {searchList.collections.map((item, index) => (
                  <div
                    key={index}
                    className={styles.selection}
                    onClick={() => {
                      router.push(`/collection/${item.id}`)
                      setFocus(false)
                      onClose()
                    }}
                  >
                    <div className="w-[36px] lg:w-[46px] h-[36px] lg:h-[46px] mr-5">
                      <ImageWithFoster
                        src={item.image_url}
                        width={50}
                        className="object-cover rounded-[10px] w-full h-full"
                      />
                    </div>
                    <div>
                      <div className={styles.text}>{item.name}</div>
                      <div className={styles.username}>{getDisplayUserName(item.artist_name)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBox
