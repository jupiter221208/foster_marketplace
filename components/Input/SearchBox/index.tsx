import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// custom components
import OutlineButton from 'components/Button/OutlineButton'

// custom functions
import { useViewport } from 'utils'

// import images and icons
import SearchGrayIcon from 'assets/icons/search-gray.svg'
import CloseGrayIcon from 'assets/icons/close-gray.svg'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

const SearchBox = props => {
  const { value, placeholder, onChange, searchList, onClick, onClose } = props
  const viewport = useViewport()
  const router = useRouter()

  return (
    <div className={styles.container}>
      <div className={styles.iconArea}>
        <Image
          src={value !== '' ? CloseGrayIcon : SearchGrayIcon}
          alt=""
          width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 16}
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 16}
          className="cursor-pointer"
          onClick={() => onClick()}
        />
      </div>
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />

      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <div>
          <OutlineButton
            label="Cancel"
            onClick={() => onClose()}
            backgroundColor="transparent"
            borderColor="transparent"
          />
        </div>
      ) : (
        <></>
      )}
      {searchList.nfts.length === 0 && searchList.artists.length === 0 && searchList.collections.length === 0 ? null : (
        <div className={styles.contentArea}>
          {searchList.nfts.length !== 0 && <div className={`${styles.title} mb-[26px]`}>NFTs</div>}
          <div className="w-full flex flex-wrap gap-[9px]">
            {searchList.nfts.map((item, index) => (
              <div
                key={index}
                className={styles.selection}
                onClick={() => {
                  router.push(`/browse-nft?id=${item.id}`)
                  onClose()
                }}
              >
                <div className="w-[35px] h-[35px] mr-5">
                  <img src={item.image_url} alt="" width={35} height={35} className="object-cover rounded-full" />
                </div>
                <div>
                  <div className={styles.text}>{item.name}</div>
                  <div className={styles.username}>{item.name}</div>
                </div>
              </div>
            ))}
          </div>
          {searchList.nfts.length !== 0 && searchList.artists.length !== 0 && <div className="w-full h-10" />}
          {searchList.artists.length !== 0 && <div className={`${styles.title} mb-[26px]`}>Artists</div>}
          <div className="w-full flex flex-wrap gap-[9px]">
            {searchList.artists.map((item, index) => (
              <div
                key={index}
                className={styles.selection}
                onClick={() => {
                  router.push(`/artist-profile?id=${item.id}`)
                  onClose()
                }}
              >
                <div className="w-[35px] h-[35px] mr-5">
                  {item.image_url.length > 0 ? (
                    <img src={item.image_url} alt="" width={35} height={35} className="object-cover rounded-full" />
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
                <div className={styles.text}>{item.name}</div>
              </div>
            ))}
          </div>
          {(searchList.nfts.length !== 0 || searchList.artists.length !== 0) && searchList.collections.length !== 0 && (
            <div className="w-full h-10" />
          )}
          {searchList.collections.length !== 0 && <div className={`${styles.title} mb-[26px]`}>Collections</div>}
          <div className="w-full flex flex-wrap gap-[9px]">
            {searchList.collections.map((item, index) => (
              <div
                key={index}
                className={styles.selection}
                onClick={() => {
                  router.push(`/category/${item.id}`)
                  onClose()
                }}
              >
                <div className="w-[35px] h-[35px] mr-5">
                  <img src={item.image_url} alt="" width={35} height={35} className="object-cover rounded-full" />
                </div>
                <div className={styles.text}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBox
