import React, { useState, useEffect } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'
// next component

// images
import ArrowRightWhiteIcon from 'assets/icons/arrow-right-white-medium.svg?component'
import ArrowDownWhiteIcon from 'assets/icons/arrow-down-white.svg?component'
import DownloadIcon from 'assets/icons/download-icon.svg?component'

// styles
import styles from './index.module.scss'

const MerchOrderDetail = props => {
  const { type, userDetail, productDetail, description, downloadFiles } = props
  const { publicKey } = useWallet()
  const [showDescription, setShowDescription] = useState(true)
  const [showEmbroidery, setShowEmbroidery] = useState(false)
  const [showNotice, setShowNotice] = useState(false)
  const [descCount, setDescCount] = useState(280)
  const [isTruncated, setIsTruncated] = useState(true)
  const [tempNftDescription, setTempNftDescription] = useState('')
  const processedNftDescription = isTruncated ? tempNftDescription.slice(0, descCount) : tempNftDescription
  const shouldShowReadMore = tempNftDescription.length > descCount

  useEffect(() => {
    function handleResize() {
      let screenWidth = window.innerWidth
      let count = screenWidth >= 1536 ? 240 : screenWidth >= 1280 ? 220 : screenWidth >= 1024 ? 200 : 200
      setDescCount(count)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setTempNftDescription(description)
  }, [description])

  function toggleIsTruncated() {
    setIsTruncated(!isTruncated)
  }

  return (
    <div>
      <div
        className="w-full flex justify-between items-center lg:mt-[35px] mt-[30px]"
        onClick={() => setShowDescription(!showDescription)}
      >
        <div className={styles.desc}>Description</div>
        <div>{showDescription ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />}</div>
      </div>
      {showDescription && (
        <div>
          {productDetail.fulfillment_type === 'foster' && (
            <div className="mt-[15px]">
              <div className={styles.descValue}>{tempNftDescription}</div>
            </div>
          )}
          {productDetail.fulfillment_type === 'user' && (
            <div className="mt-[15px]">
              <div className={`mt-[10px] ${styles.itemDesc}`}>
                {processedNftDescription}
                {shouldShowReadMore && (
                  <span onClick={toggleIsTruncated} className={`${styles.greenText} min-w-max cursor-pointer`}>
                    {isTruncated ? '... Expand' : ' Collapse'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <div className={`mt-[15px] ${styles.divider}`} />

      {/* Embroidery Disclaimer */}
      {type === 'foster' && productDetail?.options?.print_technique === 'embroidery' && (
        <div>
          <div
            className="w-full flex justify-between items-center mt-[15px]"
            onClick={() => setShowEmbroidery(!showEmbroidery)}
          >
            <div className={styles.desc}>Embroidery Disclaimer</div>
            <div>{showEmbroidery ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />}</div>
          </div>

          {showEmbroidery && (
            <div className={`${styles.endsTime} mt-[15px]`}>
              {
                'Please note that the actual embroidered design may vary from the digital preview shown. While we strive for accuracy, the nature of embroidery can result in differences in color, texture, and placement.'
              }
            </div>
          )}
          <div className={`mt-[15px] ${styles.divider}`} />
        </div>
      )}

      {/* Customs Notice */}
      <div className="w-full flex justify-between items-center mt-[15px]" onClick={() => setShowNotice(!showNotice)}>
        <div className={styles.desc}>{type === 'foster' ? 'Customs Notice' : 'Liability Disclaimer'}</div>
        <div>{showNotice ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />}</div>
      </div>
      {showNotice && (
        <div className={`${styles.endsTime} mt-[15px]`}>
          {type === 'foster'
            ? 'All customers outside of the United States are responsible for the customs fees/duties that may be charged by their country for import. This amount may vary depending on your country. We advise looking up your country’s policies before purchasing so you are aware of any potential fees.'
            : 'Users are solely responsible for conducting their own due diligence before engaging in any transaction. All transactions are conducted at your own risk. Any disputes arising from transactions conducted on the platform are to be resolved directly between the buyer and seller.'}
        </div>
      )}
      <div className={`mt-[15px] ${styles.divider}`} />

      {/* Download Mockups */}
      {publicKey?.toBase58() === userDetail?.wallet_id && productDetail.fulfillment_type === 'foster' && (
        <div className="w-full lg:flex hidden justify-end mt-[35px]">
          <div className={styles.mockups} onClick={() => downloadFiles()}>
            <DownloadIcon />
            <div>Download Mockups</div>
          </div>
        </div>
      )}
      <div className="block mb-[100px]" />
    </div>
  )
}

export default MerchOrderDetail
