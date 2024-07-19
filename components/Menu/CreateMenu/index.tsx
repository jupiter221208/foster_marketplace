import React, { MutableRefObject, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useAuthentication } from 'hooks/useAuthentication'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
// third party components
import { Menu as HMenu } from '@headlessui/react'

// resources
import SingleNftIcon from 'assets/icons/create-nft-icon.svg?component'
import EditionIcon from 'assets/icons/create-edition-icon.svg?component'
import CollectionIcon from 'assets/icons/create-collection-icon.svg?component'
import EAIcon from 'assets/icons/create-ea-icon.svg?component'
import MerchIcon from 'assets/icons/create-merch-icon.svg?component'

// styles
import styles from './index.module.scss'
import { useRouter } from 'next/router'

const CreateMenu = () => {
  const { profileInfo } = useAuthentication()
  const router = useRouter()
  const dispatch = useDispatch()
  const { setVisible } = useWalletModal()
  const { connected } = useWallet()
  const menuRef = useRef<HTMLElement | null>(null)
  const itemRef = useRef<HTMLElement | null>(null)

  const [isMenuOpen, setIsMenuOpen] = React.useState(false) // Initially menu is hidden

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen) // Toggle the current boolean value
  }

  const handleClickOutside = event => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      itemRef.current &&
      !itemRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <div className="flex items-center">
      <HMenu>
        <HMenu.Button ref={itemRef as MutableRefObject<HTMLButtonElement>}>
          <div
            className={styles.container}
            onClick={() => {
              if (!connected) {
                setVisible(true)
              } else {
                toggleMenu()
              }
            }}
          >
            <div>Create</div>
          </div>
        </HMenu.Button>
        {isMenuOpen && (
          <div ref={menuRef as MutableRefObject<HTMLDivElement>} className={styles.menuArea}>
            <div className="flex flex-col gap-[15px]">
              <div
                className={styles.text}
                onClick={() => {
                  dispatch({ type: 'set', createTab: 0 })
                  router.push('/create/single-nft')
                  setIsMenuOpen(false)
                }}
              >
                <SingleNftIcon />
                1/1 Collectible
              </div>
              <div
                className={styles.text}
                onClick={() => {
                  dispatch({ type: 'set', createTab: 1 })
                  router.push('/create/single-nft')
                  setIsMenuOpen(false)
                }}
              >
                <EditionIcon />
                Editions
              </div>
              <div
                className={styles.text}
                onClick={() => {
                  dispatch({ type: 'set', mintCollectionStep: 1 })
                  dispatch({ type: 'set', collectionMintAddress: '' })
                  dispatch({ type: 'set', collectionCoverUrl: '' })
                  dispatch({ type: 'set', collectionKind: 'foster' })
                  router.push('/create/collection')
                  setIsMenuOpen(false)
                }}
              >
                <CollectionIcon />
                Collection
              </div>
              <div
                className={styles.text}
                onClick={() => {
                  dispatch({ type: 'set', mintCollectionStep: 1 })
                  dispatch({ type: 'set', collectionMintAddress: '' })
                  dispatch({ type: 'set', collectionCoverUrl: '' })
                  dispatch({ type: 'set', collectionKind: 'ea' })
                  router.push('/create/collection')
                  setIsMenuOpen(false)
                }}
              >
                <EAIcon />
                Import EA Series
              </div>
              <div
                className={styles.text}
                onClick={() => {
                  router.push(`/${profileInfo.username.replaceAll(' ', '%20')}/merch/new`)
                  setIsMenuOpen(false)
                }}
              >
                <MerchIcon />
                Custom Merch
              </div>
            </div>
          </div>
        )}
      </HMenu>
    </div>
  )
}

export default CreateMenu
