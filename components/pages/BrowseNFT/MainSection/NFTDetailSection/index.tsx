import React, { useEffect, useState } from 'react'

// components
import { useRouter } from 'next/router'
import Link from 'next/link'

// utilies
import { getDisplayUserName } from 'utils/strings'

// resources
import ArrowRightIcon from 'assets/icons/arrow-right-line.svg?component'

// styles
import styles from './index.module.scss'
import { getFirstUpperString } from 'utils/helpers'

const NFTDetailSection = props => {
  const {
    nftOwnerUsername,
    nftType,
    nftCoverUrl,
    editionType,
    editionDetail,
    supply,
    isNftMasterEdition,
    isNftPrintEdition,
    royalties,
  } = props
  const router = useRouter()
  const [dimensions, setDimensions] = useState(null)

  useEffect(() => {
    if (nftType.includes('image')) {
      const img = new window.Image()
      img.src = nftCoverUrl
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height })
      }
    }
  }, [nftCoverUrl])

  const getType = type => {
    if (type.includes('/')) {
      let main_type = type.slice(0, type.indexOf('/'))
      let sub_type = type.slice(type.indexOf('/') + 1, type.length)
      return getFirstUpperString(main_type) + ' (' + sub_type.toUpperCase() + ')'
    } else {
      return getFirstUpperString(type)
    }
  }

  console.log(editionDetail, isNftMasterEdition, isNftPrintEdition, nftType)

  return (
    <div>
      <div className={styles.details}>Details</div>

      {editionDetail && (isNftMasterEdition || isNftPrintEdition) ? (
        <div>
          <div className="w-full flex justify-between items-center mt-[6px]">
            <div className={styles.label}>Token Type</div>
            <div className={styles.value}>{editionType === 'print_le' ? 'Limited Edition' : 'Open Edition'}</div>
          </div>

          {editionType === 'master_le' && (
            <div className="w-full flex justify-between items-center mt-[6px]">
              <div className={styles.label}>Max Supply</div>
              <div className={styles.value}>{editionDetail?.maxSupply}</div>
            </div>
          )}
          {isNftMasterEdition ? (
            <div className="w-full flex justify-between items-center mt-[6px]">
              <div className={styles.label}>Editions Sold</div>
              <div className={styles.value}>{editionDetail?.supply}</div>
            </div>
          ) : (
            <div className="w-full flex justify-between items-center mt-[6px]">
              <div className={styles.label}>Editions Number</div>
              <div className={styles.value}>{Number(editionDetail?.print?.number)}</div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="w-full flex justify-between items-center mt-[6px]">
            <div className={styles.label}>Medium</div>
            <div className={styles.value}>{getType(nftType)}</div>
          </div>
          {dimensions && (
            <div className="w-full flex justify-between items-center mt-[6px]">
              <div className={styles.label}>Dimensions</div>
              <div className={styles.value}>
                {dimensions.width}px by {dimensions.height}px
              </div>
            </div>
          )}
        </div>
      )}

      <div className="w-full flex justify-between items-center mt-[6px]">
        <div className={styles.label}>Royalties</div>
        <div className={styles.value}>{royalties}%</div>
      </div>

      {!isNftMasterEdition && (
        <div className="w-full flex justify-between items-center mt-[6px]">
          <div className={styles.label}>Owner</div>
          <div className={styles.value}>{nftOwnerUsername}</div>
        </div>
      )}

      {editionDetail && isNftPrintEdition && (
        <div
          className="w-full flex items-center  gap-[8px] mt-[6px]"
          onClick={() => {
            router.push(`/nft/${supply.parent}`)
          }}
        >
          <div className={styles.label}>Master Edition</div>
          <ArrowRightIcon />
        </div>
      )}
      <div className={styles.descBorder} />
    </div>
  )
}

export default NFTDetailSection
