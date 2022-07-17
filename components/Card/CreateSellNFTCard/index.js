import React from 'react'

// next components
import { useRouter } from 'next/router'
import Image from 'next/image'

// images and icons
import ArrowRightGreenIcon from 'assets/icons/arrow-right-green.svg'

// styles
import styles from './index.module.scss'

const CreateSellNFTCard = props => {
  const { title, description, linkText, link } = props

  const router = useRouter()
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.link} onClick={() => router.push(link)}>
        {linkText}
        <div className="ml-4">
          <Image src={ArrowRightGreenIcon} alt="" />
        </div>
      </div>
    </div>
  )
}

export default CreateSellNFTCard
