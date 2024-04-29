import React, { useState } from 'react'

// next components
// import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'

// Web3
import { PublicKey, Keypair } from '@solana/web3.js'
import { useMetaplex } from 'hooks/useMetaplex'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-tiny.svg?component'

// styles
import styles from './index.module.scss'
import { getPriceValue } from 'utils/strings'
import Link from 'next/link'
import ImageWithFoster from 'components/ImageWithFoster'
import OutlineButton from 'components/Button/OutlineButton'
import LoadingButton from 'components/Button/LoadingButton'

// api
import { revokeDelegateEdition } from 'utils/editions'
import { cancelListingEdition } from 'apis/editions'
import PrimaryButton from 'components/Button/PrimaryButton'
import LoadingSecondaryButton from 'components/Button/LoadingSecondaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'

export interface ListedEditionCardProps {
  data: any
  onClick: (uri: string) => any
  onUpdateList: any
  onCancelSuccess: any
}

const ListedEditionCard = ({ data, onClick, onUpdateList, onCancelSuccess }: ListedEditionCardProps) => {
  const { address, name, type, assetUrl, coverUrl, creatorAddress, price } = data
  const viewport = useViewport()
  const { metaplex: mx } = useMetaplex()

  const [cancelListLoading, setCancelListLoading] = useState(false)

  const cancelListEdition = async () => {
    let item = data
    setCancelListLoading(true)
    try {
      const listing = await revokeDelegateEdition({
        metaplex: mx,
        mint: new PublicKey(item?.address),
        // delegate: new PublicKey(item?.authority),
        delegate: Keypair.fromSecretKey(Uint8Array.from(item?.authority)).publicKey,
      })

      if (listing) {
        cancelListingEdition(item?.address).then(res => {
          if (res) {
            onCancelSuccess()
          }
        })
      }
    } catch (e) {
      setCancelListLoading(false)
    }
  }

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <Link href={`/nft/${address}`} passHref>
          <a>
            <div className={styles.imageContent}>
              {type === 'video' ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
              <source src=${assetUrl} type="video/mp4" /></video>`,
                  }}
                />
              ) : (
                <div className="w-full h-full">
                  <ImageWithFoster src={coverUrl} width={360} className="max-w-full max-h-full object-cover" />
                </div>
              )}
            </div>
          </a>
        </Link>
      </div>
      <div className={styles.bottomSection}>
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{name}</div>
          <div className="flex items-center gap-[6px]">
            <div className="mt-[4px]">
              <SolanaLogoIcon alt="" />
            </div>
            <div className={styles.price}>{getPriceValue(price)}</div>
          </div>
        </div>
        <div className="w-full hidden lg:flex flex-wrap gap-[8px] mt-[15px]">
          <PrimaryButton label="Update or Relist" type="update-relist" onClick={() => onUpdateList()} fullWidth />
          {cancelListLoading ? (
            <LoadingSecondaryButton fullWidth />
          ) : (
            <SecondaryButton label={'Cancel Listing'} type="cancel" fullWidth onClick={() => cancelListEdition()} />
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent} onClick={() => onClick(`/nft/${address}`)}>
          <div className="w-full h-full flex items-center">
            <ImageWithFoster width={200} src={coverUrl} className="max-w-full max-h-full object-cover" />
          </div>
        </div>
      </div>
      <div className={styles.bottomSection}>
        <div className="w-full flex justify-between items-center">
          <div className={styles.nftName}>{name}</div>
          <div className="flex items-center gap-[2px]">
            <div className="mt-[2px]">
              <SolanaLogoMobileIcon alt="" />
            </div>
            <div className={styles.price}>{getPriceValue(price)}</div>
          </div>
        </div>

        <div className="w-full flex flex-wrap gap-[8px] items-center mt-[6px]">
          <GradientButton
            fullWidth
            label="Update/Relist"
            onClick={() => onUpdateList()}
            height="28px"
            fontSize="12px"
            borderRadius="5px"
          />

          {cancelListLoading ? (
            <LoadingButton fullWidth height={28} borderRadius={5} mobileLoading={true} />
          ) : (
            <OutlineButton
              label={'Cancel Listing'}
              fullWidth
              backgroundColor="transparent"
              onClick={() => cancelListEdition()}
              fontFamily="Muli-SemiBold"
              fontSize={12}
              height="28px"
              borderRadius="5px"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ListedEditionCard
