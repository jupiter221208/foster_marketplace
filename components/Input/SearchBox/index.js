import React from 'react'

// next components
import Image from 'next/image'

// import images and icons
import SearchGrayIcon from 'assets/icons/search-gray.svg'
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// styles
import styles from './index.module.scss'

const SearchBox = props => {
  const { value, placeholder, onChange, searchList, viewport = 'sm', onClick, onClose } = props
  return (
    <div className={styles.container}>
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
      <Image
        src={viewport === 'sm' || viewport === 'md' ? CloseWhiteIcon : SearchGrayIcon}
        alt=""
        className="cursor-pointer"
        onClick={() => onClick()}
      />
      {searchList.nfts.length === 0 && searchList.artists.length === 0 && searchList.collections.length === 0 ? null : (
        <div className={styles.contentArea}>
          {searchList.nfts.length !== 0 && <div className={`${styles.title} mb-[26px]`}>NFTs</div>}
          <div className="w-full flex flex-wrap gap-[9px]">
            {searchList.nfts.map((item, index) => (
              <div key={index} className={styles.selection} onClick={() => onClose()}>
                <div className="w-[35px] h-[35px] mr-5">
                  <Image
                    src={item.image}
                    alt=""
                    width={35}
                    height={35}
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className={styles.text}>{item.label}</div>
              </div>
            ))}
          </div>
          {searchList.nfts.length !== 0 && searchList.artists.length !== 0 && <div className="w-full h-10" />}
          {searchList.artists.length !== 0 && <div className={`${styles.title} mb-[26px]`}>Artists</div>}
          <div className="w-full flex flex-wrap gap-[9px]">
            {searchList.artists.map((item, index) => (
              <div key={index} className={styles.selection} onClick={() => onClose()}>
                <div className="w-[35px] h-[35px] mr-5">
                  <Image
                    src={item.image}
                    alt=""
                    width={35}
                    height={35}
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className={styles.text}>{item.label}</div>
              </div>
            ))}
          </div>
          {(searchList.nfts.length !== 0 || searchList.artists.length !== 0) && searchList.collections.length !== 0 && (
            <div className="w-full h-10" />
          )}
          {searchList.collections.length !== 0 && <div className={`${styles.title} mb-[26px]`}>Collections</div>}
          <div className="w-full flex flex-wrap gap-[9px]">
            {searchList.collections.map((item, index) => (
              <div key={index} className={styles.selection} onClick={() => onClose()}>
                <div className="w-[35px] h-[35px] mr-5">
                  <Image
                    src={item.image}
                    alt=""
                    width={35}
                    height={35}
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className={styles.text}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBox
