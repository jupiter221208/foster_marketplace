import React from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

// images and icons
import ArrowRightGreenIcon from 'assets/icons/arrow-right-green.svg?component'

// styles
import styles from './index.module.scss'

const CreateSellNFTCard = props => {
  const { title, description, linkText, link } = props

  const router = useRouter()
  const dispatch = useDispatch()
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const handleClickEvent = () => {
    switch (link) {
      case 'connectYourWallet':
        if (!connected) {
          setVisible(true)
        }
        break
      case 'openCreateNFTModal':
        dispatch({ type: 'set', openCreateNFTModal: true })
        break
      case 'listYourNFTs':
        if (connected) {
          router.push('/dashboard')
        } else {
          setVisible(true)
        }
        break
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.link} onClick={() => handleClickEvent()}>
        {linkText}
        <div className="ml-4">
          {/* <Image src={ArrowRightGreenIcon} alt="" /> */}
          <ArrowRightGreenIcon />
        </div>
      </div>
    </div>
  )
}

export default CreateSellNFTCard
