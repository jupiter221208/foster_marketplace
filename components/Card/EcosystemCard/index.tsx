import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import CheckedGreenIcon from 'assets/icons/checked-green.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const EcosystemCard = props => {
  const { data, onClick } = props
  const viewport = useViewport()

  return (
    <div className={styles.container} onClick={() => onClick()}>
      <div className="relative flex justify-center">
        <div className="w-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
          <Image src={data.image} alt="" width={321} height={321} layout="responsive" objectFit="cover" />
        </div>
        <div className={styles.avatarArea}>
          <Image
            src={data.avatar}
            width={viewport === 'xs' ? 32 : 70}
            height={viewport === 'xs' ? 32 : 70}
            className="rounded-full"
            alt=""
          />
        </div>
      </div>
      <div className="w-full sm:mt-[50px] xs:mt-[26px] flex flex-wrap justify-center items-center px-[9px]">
        <div className="w-full flex justify-center items-center">
          <div className={styles.artistName}>{data.artistName}</div>
          <div className="flex justify-center items-center ml-[4px] lg:ml-[10px]">
            <Image
              src={CheckedGreenIcon}
              alt=""
              width={viewport === 'xs' ? 11 : viewport === 'sm' ? 16 : 24}
              height={viewport === 'xs' ? 11 : viewport === 'sm' ? 16 : 24}
            />
          </div>
        </div>
      </div>
      <div className={styles.contentCard}>
        <div className="w-full flex flex-wrap justify-between">
          <div className="flex">
            <div className={styles.title}>NFTs :</div>
            <div className={styles.text}>{data.nfts}</div>
          </div>
          <div className="flex">
            <div className={styles.title}>Followers :</div>
            <div className={styles.text}>{data.followers}</div>
          </div>
        </div>
        <div className="w-full flex flex-wrap justify-between">
          <div className="flex">
            <div className={styles.title}>Collections :</div>
            <div className={styles.text}>{data.collections}</div>
          </div>
          <div className="flex">
            <div className={styles.title}>Floor :</div>
            <Image
              src={SolanaLogoIcon}
              alt=""
              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 10 : 21}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 10 : 21}
            />
            <div className={styles.text}>{data.floor}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EcosystemCard
