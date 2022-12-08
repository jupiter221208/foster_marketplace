import React, { useRef } from 'react'

// next components
import Image from 'next/image'

// components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

// styles
import styles from './index.module.scss'
import { getShortAddress } from 'utils/wallet.util'
import { getPriceValue, timeSince } from 'utils/strings'

const OfferAccordion = props => {
  const { data, onCancel, onAccept } = props
  const buttonRefs = useRef<any[]>([])
  const openedRef = useRef<any>(null)
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
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={open ? styles.activeButton : styles.button}
                  data-value={open}
                  ref={ref => {
                    buttonRefs.current[index] = ref
                  }}
                  onClick={() => clickRecent(index)}
                >
                  <div className="flex items-center gap-x-4">
                    <div className={open ? styles.activeImageArea : styles.imageArea}>
                      <Image src={item.asset.json.image} alt="" width={52} height={52} className="rounded-[4px]" />
                    </div>

                    <div className="block">
                      <div className={styles.subTitle}>{item.asset.json.name}</div>
                      <div className={styles.subTitle}>{getShortAddress(item.asset.mint.address.toString())}</div>
                    </div>
                  </div>

                  <ChevronUpIcon
                    className={`${!open ? 'rotate-180 transform' : ''} h-6 w-6`}
                    style={{ color: open ? '#5AC3BA' : '#378287' }}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  {item.isIncoming && (
                    <div className={styles.firstRow}>
                      <div className={styles.title}>Offer</div>
                      {item.isOutgoing ? (
                        <div className={styles.text}>Outgoing</div>
                      ) : (
                        <div className={styles.text}>Incoming</div>
                      )}
                    </div>
                  )}
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Listing</div>
                    {item.isListed ? (
                      <div className={styles.text}>Listed</div>
                    ) : (
                      <div className={styles.text}>Unlisted</div>
                    )}
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Time</div>
                    <div className={styles.text}>{timeSince(item.createdAt.toNumber())}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Amount</div>
                    <div className={styles.text}>{getPriceValue(item.price.basisPoints.toNumber())}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Member</div>
                    {item.isOutgoing ? (
                      <div className={styles.text}>{getShortAddress(item.owner)}</div>
                    ) : (
                      <div className={styles.text}>{getShortAddress(item.buyer)}</div>
                    )}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <div className="absolute top-[16px] right-[50px]">
            {item.isOutgoing ? (
              <OutlineButton
                label="Cancel"
                onClick={() => onCancel(item.tradeStateAddress)}
                color="#DEEFD0"
                borderColor="#DEEFD0"
                width="80px"
                height="42px"
              />
            ) : (
              <GradientButton
                label="Accept"
                onClick={() =>
                  onAccept(
                    item.asset.mint.address.toString(),
                    item.tradeStateAddress,
                    item.listingTradeStateAddress,
                    item.buyer,
                    getPriceValue(item.price.basisPoints.toNumber())
                  )
                }
                width="80px"
                height="42px"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default OfferAccordion
