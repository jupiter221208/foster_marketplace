import React from 'react'

// next components

// styles
import styles from './index.module.scss'

import NftCategoryIcon from 'assets/icons/dashboard-icon.svg?component'
import NftCollectionIcon from 'assets/icons/collection-icon.svg?component'
import NftArtistIcon from 'assets/icons/artist-icon.svg?component'
import SingleNftIcon from 'assets/icons/single-nft-icon.svg?component'
import CollectionNftIcon from 'assets/icons/large-collection-icon.svg?component'
import Link from 'next/link'

const MenuItem = props => {
  const { key, item, onSelect } = props

  return (
    <Link href={`/${item.path}`} passHref>
      <a>
        <div
          key={key}
          className={styles.menuItem}
          onClick={() => {
            onSelect(item)
          }}
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
          </div>
          <span className="mt-2">{item.label}</span>
        </div>
      </a>
    </Link>
  )
}

export default MenuItem
