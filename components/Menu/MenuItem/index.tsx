import React, { useState } from 'react'

// next components

// styles
import styles from './index.module.scss'

import NftCategoryIcon from 'assets/icons/dashboard-icon.svg?component'
import NftCollectionIcon from 'assets/icons/collection-icon.svg?component'
import NftArtistIcon from 'assets/icons/artist-icon.svg?component'
import SingleNftIcon from 'assets/icons/single-nft-icon.svg?component'
import CollectionNftIcon from 'assets/icons/large-collection-icon.svg?component'

import NftCategoryGreenIcon from 'assets/icons/dashboard-green.svg?component'
import NftCollectionGreenIcon from 'assets/icons/collection-green.svg?component'
import NftArtistGreenIcon from 'assets/icons/artist-green.svg?component'
import SingleNftGreenIcon from 'assets/icons/single-nft-green.svg?component'
import CollectionNftGreenIcon from 'assets/icons/large-collection-green.svg?component'

const MenuItem = props => {
  const { key, item, onSelect } = props

  return (
    <div
      key={key}
      className={styles.menuItem}
      onClick={() => {
        onSelect(item)
      }}
      // onMouseEnter={() => setHover(true)}
      // onMouseLeave={() => setHover(false)}
    >
      <div className="w-12 h-12">
        {item.type === 'nft_category' ? (
          <NftCategoryIcon className={styles.iconFill} />
        ) : item.type === 'nft_collection' ? (
          <NftCollectionIcon className={styles.iconFill} />
        ) : item.type === 'nft_artist' ? (
          <NftArtistIcon className={styles.iconFill} />
        ) : item.type === 'single_nft' ? (
          <SingleNftIcon className={styles.iconFill} />
        ) : item.type === 'collection_nft' ? (
          <CollectionNftIcon className={styles.iconFill} />
        ) : (
          <div />
        )}
        {/* <Image src={item.icon} alt="" width={40} height={40} /> */}
      </div>
      <span className="mt-2">{item.label}</span>
    </div>
  )
}

export default MenuItem
