import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

// custom components
import OutlineButton from 'components/Button/OutlineButton'

// custom functions
import { useViewport } from 'utils'

// import images and icons
import SearchGrayIcon from 'assets/icons/search-gray.svg'
import SearchDarkIcon from 'assets/icons/search-dark.svg'
import CloseGrayIcon from 'assets/icons/close-gray.svg'
import CloseDarkIcon from 'assets/icons/close-dark.svg'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import DefaultNftBG from 'assets/images/default-nft-bg.png'

// styles
import styles from './index.module.scss'

const SearchBox = props => {
  const { value, placeholder, onChange, searchList, onClick, onClose } = props
  const viewport = useViewport()
  const router = useRouter()
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <div className={styles.container}>
      <div className={`${styles.iconArea} ${lightMode ? styles.lightIconArea : ''}`}>
        <Image
          src={value !== '' ? (lightMode ? CloseDarkIcon : CloseGrayIcon) : lightMode ? SearchDarkIcon : SearchGrayIcon}
          alt=""
          width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 16}
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 16}
          className="cursor-pointer"
          onClick={() => onClick()}
        />
      </div>
      <input
        className={lightMode ? styles.lightInputArea : styles.inputArea}
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
            color={lightMode ? '#202427' : '#eff0f6'}
          />
        </div>
      ) : value !== '' ? (
        <div>
          <OutlineButton
            label="Cancel"
            onClick={() => onClose()}
            fontSize={16}
            width={60}
            fontFamily="Muli-Regular"
            color={lightMode ? '#202427' : '#eff0f6'}
            backgroundColor="transparent"
            borderColor="transparent"
          />
        </div>
      ) : (
        <></>
      )}
      {searchList.nfts.length === 0 && searchList.artists.length === 0 && searchList.collections.length === 0 ? null : (
        <div className={styles.contentArea}>
          {searchList.nfts.length !== 0 && (
            <div className={`${styles.title} ${lightMode ? styles.lightColor : ''} mb-[18px]`}>ARTWORK</div>
          )}
          <div className="w-full flex flex-wrap">
            {searchList.nfts.map((item, index) => (
              <div
                key={index}
                className={styles.selection}
                onClick={() => {
                  router.push(`/browse-nft?id=${item.id}`)
                  onClose()
                }}
              >
                <div className="w-[36px] lg:w-[46px] h-[36px] lg:h-[46px] mr-5 overflow-hidden rounded-[10px]">
                  {item.image_url !== null && item.image_url !== '' ? (
                    <img src={item.image_url} alt="" className="object-cover w-full h-full" />
                  ) : (
                    <Image src={DefaultNftBG} alt="" className="w-full h-full object-cover " />
                  )}
                </div>
                <div>
                  <div className={`${styles.text} ${lightMode ? styles.lightColor : ''}`}>{item.name}</div>
                  <div className={`${styles.username} ${lightMode ? styles.lightUsername : ''}`}>
                    {item.artist_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {searchList.nfts.length !== 0 && searchList.artists.length !== 0 && <div className="w-full h-10" />}
          {searchList.artists.length !== 0 && (
            <div className={`${styles.title} ${lightMode ? styles.lightColor : ''} mb-[18px]`}>ARTIST</div>
          )}
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
                <div className="w-[36px] h-[36px] mr-5">
                  {item.image_url.length > 0 ? (
                    <img src={item.image_url} alt="" className="object-cover rounded-full w-full h-full" />
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
                <div className={`${styles.text} ${lightMode ? styles.lightColor : ''}`}>{item.name}</div>
              </div>
            ))}
          </div>
          {(searchList.nfts.length !== 0 || searchList.artists.length !== 0) && searchList.collections.length !== 0 && (
            <div className="w-full h-10" />
          )}
          {searchList.collections.length !== 0 && (
            <div className={`${styles.title} ${lightMode ? styles.lightColor : ''} mb-[18px]`}>COLLECTION</div>
          )}
          <div className="w-full flex flex-wrap gap-[9px]">
            {searchList.collections.map((item, index) => (
              <div
                key={index}
                className={styles.selection}
                onClick={() => {
                  router.push(`/browse-collection/${item.id}`)
                  onClose()
                }}
              >
                <div className="w-[36px] lg:w-[46px] h-[36px] lg:h-[46px] mr-5">
                  <img src={item.image_url} alt="" className="object-cover rounded-[10px] w-full h-full" />
                </div>
                <div>
                  <div className={`${styles.text} ${lightMode ? styles.lightColor : ''}`}>{item.name}</div>
                  <div className={`${styles.username} ${lightMode ? styles.lightUsername : ''}`}>
                    {item.artist_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBox
