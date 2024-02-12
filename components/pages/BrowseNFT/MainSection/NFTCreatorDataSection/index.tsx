import React, { Suspense } from 'react'

import Link from 'next/link'
// components

// utilies
import { getDisplayUserName } from 'utils/strings'

// resources

// styles
import styles from './index.module.scss'

import { useDispatch } from 'react-redux'

const NFTCreatorDataSection = props => {
  const { nftName, nftCreatorname, nftOwnerUsername, nameLoading } = props
  const dispatch = useDispatch()

  const gotoUserDetail = link => {
    dispatch({ type: 'set', isLoading: true })
  }

  return (
    <Suspense fallback={<Loading />}>
      {nameLoading ? (
        <div
          className={`${styles.skeletonLoader} ${styles.title} w-[200px] lg:w-[360px] h-[40px] lg:h-[60px] mt-[15px] lg:mt-[28px] rounded-full`}
        ></div>
      ) : (
        <>
          <div className="w-full flex mt-[15px] lg:mt-[28px]">
            <div className={styles.title}>{nftName}</div>
          </div>

          <div className="w-full flex flex-wrap mt-[9px] lg:mt-[6px] gap-x-[14px] lg:gap-x-[34px]">
            <div className="flex gap-1 lg:gap-2">
              <div className={styles.grayText}>Created by</div>
              <Link href={`/${nftCreatorname}`} passHref>
                <a>
                  <div className={styles.greenText} onClick={() => gotoUserDetail(nftCreatorname)}>
                    {getDisplayUserName(nftCreatorname)}
                  </div>
                </a>
              </Link>
            </div>

            {nftOwnerUsername.length > 0 && nftOwnerUsername !== nftCreatorname && (
              <div className="flex gap-1 lg:gap-2">
                <div className={styles.grayText}>Fostered by</div>
                <Link href={`/${nftOwnerUsername}`} passHref>
                  <a>
                    <div className={styles.greenText} onClick={() => gotoUserDetail(nftOwnerUsername)}>
                      {getDisplayUserName(nftOwnerUsername)}
                    </div>
                  </a>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </Suspense>
  )
}

function Loading() {
  return <div></div>
}
export default NFTCreatorDataSection
