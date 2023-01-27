import React, { useEffect, useRef, useState, type MutableRefObject } from 'react'

// next components
import Image from 'next/image'

// web3
import { type PublicKey } from '@solana/web3.js'
import { type JsonMetadata } from '@metaplex-foundation/js'
import { useMetaplex } from 'hooks/useMetaplex'
import { type LazyBidWithAsset } from 'utils/auction.util'
import { getNFTOwner } from 'utils/nfts.utils'

// components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

// styles
import styles from './index.module.scss'
import { getPriceValue, getShortAddress, timeSince } from 'utils/strings'

export interface OfferAccordionProps {
  data: LazyBidWithAsset[]
  onAccept: (listing: LazyBidWithAsset) => any
  onCancel: (listing: LazyBidWithAsset) => any
  offerType: 'made' | 'received'
}

type OfferAccordionItemProps = Omit<OfferAccordionProps, 'data'> & {
  listing: OfferAccordionProps['data'][number]
  buttonRefs: MutableRefObject<any[]>
  clickRecent: (number) => any
  index: number
}

const OfferAccordionItem = ({
  listing,
  onAccept,
  onCancel,
  offerType,
  buttonRefs,
  clickRecent,
  index,
}: OfferAccordionItemProps) => {
  const { metaplex } = useMetaplex()

  const [ownerOrBuyerAddress, setOwnerOrBuyerAddress] = useState<PublicKey | null>(null)
  useEffect(() => {
    if (offerType === 'made') getNFTOwner(metaplex, listing.asset.mintAddress).then(setOwnerOrBuyerAddress)
    else setOwnerOrBuyerAddress(listing.buyerAddress)
  }, [offerType, metaplex, listing])

  const [assetImageUrl, setAssetImageUrl] = useState<string>('')
  useEffect(() => {
    if (listing.asset.json?.image) return
    // TODO: use loading image as placeholder
    setAssetImageUrl('')

    fetch(listing.asset.uri)
      .then(e => e.json())
      .then(({ image }) => setAssetImageUrl(image))
      .catch(e => {
        console.error(e)
        // TODO: use error image
        setAssetImageUrl('')
      })
  }, [listing.asset])

  return (
    <>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={open ? styles.activeButton : styles.button}
              data-value={open}
              ref={ref => (buttonRefs.current[index] = ref)}
              onClick={() => clickRecent(index)}
            >
              <div className="flex items-center gap-x-4">
                <div className={open ? styles.activeImageArea : styles.imageArea}>
                  <Image src={assetImageUrl} alt="" width={52} height={52} className="rounded-[4px]" />
                </div>

                <div className="block">
                  <div className={styles.subTitle}>{listing.asset.name}</div>
                  <div className={styles.amount}>{getPriceValue(listing.price.basisPoints.toNumber())}</div>
                </div>
              </div>

              <ChevronUpIcon
                className={`${!open ? 'rotate-180 transform' : ''} h-6 w-6`}
                style={{ color: open ? '#5AC3BA' : '#378287' }}
              />
            </Disclosure.Button>
            <Disclosure.Panel className={styles.panel}>
              {/* {listing.isIncoming && (
                    <div className={styles.firstRow}>
                      <div className={styles.title}>Offer</div>
                      {listing.isOutgoing ? (
                        <div className={styles.text}>Outgoing</div>
                      ) : (
                        <div className={styles.text}>Incoming</div>
                      )}
                    </div>
                  )} */}
              {/* <div className={styles.secondRow}>
                    <div className={styles.title}>Listing</div>
                    {listing.isListed ? (
                      <div className={styles.text}>Listed</div>
                    ) : (
                      <div className={styles.text}>Unlisted</div>
                    )}
                  </div> */}
              <div className={styles.firstRow}>
                <div className={styles.title}>Time</div>
                <div className={styles.text}>{timeSince(listing.createdAt.toNumber())}</div>
              </div>
              {/* <div className={styles.secondRow}>
                    <div className={styles.title}>Amount</div>
                    <div className={styles.text}>{getPriceValue(listing.price.basisPoints.toNumber())}</div>
                  </div> */}
              <div className={styles.secondRow}>
                <div className={styles.title}>{offerType === 'made' ? 'Buyer' : 'Seller'}</div>
                {ownerOrBuyerAddress ? getShortAddress(ownerOrBuyerAddress.toBase58()) : '-'}
              </div>
              <div className={styles.firstRow}>
                <div className="w-full flex justify-center">
                  <div className={styles.help}>
                    {offerType === 'made'
                      ? 'Would you like to cancel the offer?'
                      : 'Would you like to accept the offer?'}
                  </div>
                </div>
              </div>
              <div className={styles.thirdRow}>
                {offerType === 'made' ? (
                  <OutlineButton
                    label="Cancel"
                    onClick={() => onCancel(listing)}
                    color="#95DBD5"
                    borderColor="#95DBD5"
                    width="300px"
                    height="38px"
                  />
                ) : (
                  <GradientButton
                    label="Accept"
                    onClick={() => onAccept(listing)}
                    gradientDirection="right"
                    backgroundColor01="#172120"
                    backgroundColor02="#2C5E5A"
                    color="#95DBD5"
                    width="300px"
                    height="38px"
                  />
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <div className="absolute top-[16px] right-[50px]"></div>
    </>
  )
}

const OfferAccordion = ({ data, onAccept, onCancel, offerType }: OfferAccordionProps) => {
  const openedRef = useRef<any>(null)
  const buttonRefs = useRef<any[]>([])
  const clickRecent = index => {
    const clickedButton = buttonRefs.current[index]
    if (clickedButton === openedRef.current) {
      openedRef.current = null
      return
    }
    if (Boolean(openedRef.current?.getAttribute('data-value'))) {
      openedRef.current?.click()
    }
    openedRef.current = clickedButton
  }

  return (
    <div className="w-full flex flex-wrap gap-[10px]">
      {data.map((item, index) => (
        <div key={index} className="w-full relative">
          <OfferAccordionItem
            listing={item}
            onAccept={onAccept}
            onCancel={onCancel}
            offerType={offerType}
            buttonRefs={buttonRefs}
            clickRecent={clickRecent}
            index={index}
          />
        </div>
      ))}
    </div>
  )
}

export default OfferAccordion
