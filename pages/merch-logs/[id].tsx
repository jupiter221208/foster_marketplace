import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// next component
import Link from 'next/link'
import Image from 'next/image'

// Resources
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import ArrowLeftIcon from 'assets/icons/arrow-left-smallest.svg?component'
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// Styles
import styles from './id.module.scss'
import OutlineButton from 'components/Button/OutlineButton'

const MerchDetail = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <div className="g-container">
      <div className="flex gap-[15px] items-center mt-[65px]">
        <Link href="/merch-logs">
          <div className={styles.backBG}>
            <div className="hidden lg:flex mr-[2px]">
              <ArrowLeftIcon alt="" />
            </div>
            <div className="flex lg:hidden">
              <ArrowLeftIconMobile alt="" />
            </div>
          </div>
        </Link>
        <div className={styles.orderTitle}>Order#&nbsp;{id}</div>
      </div>
      <div className={styles.orderInfo}>
        <div>
          <div className={styles.infoTitle}>ORDER PLACED</div>
          <div className={styles.infoValue}>August 9, 2023</div>
        </div>
        <div>
          <div className={styles.infoTitle}>TOTAL</div>
          <div className={styles.infoValue}>$35.67</div>
        </div>
        <div>
          <div className={styles.infoTitle}>SHIP TO</div>
          <div className={styles.infoValue}>
            1234 Dragonsville Ave.
            <br />
            Phoenix, AZ 12345, United States
          </div>
        </div>
        <div>
          <div className={styles.infoTitle}>SHIPING METHOD</div>
          <div className={styles.infoValue}>USPS Priority Mail - Package</div>
        </div>
        <div>
          <div className={styles.infoTitle}>ESTIMATED DELIVERY DATE</div>
          <div className={styles.infoValue}>August 23, 2023</div>
        </div>
      </div>
      <div className="w-full flex justify-between mt-[70px]">
        <div className="max-w-[183px] object-cover">
          <Image src={DefaultAvatar} alt="" />
        </div>
        <div>
          <div className={styles.detailTitle}>Item Details</div>
          <div className={`mt-[15px] ${styles.detailValue}`}>Print: Cage of Conscience</div>
          <div className={`mt-[9px] ${styles.detailValue}`}>Quantity: 1</div>
          <div className={`mt-[9px] ${styles.detailValue}`}>Product: T-Shirt / Medium / White</div>
        </div>

        <div>
          <div className={styles.detailTitle}>Payment Details</div>
          <div className={`mt-[15px] ${styles.detailValue}`}>Payment Method: USDC</div>
          <div className={`mt-[15px] ${styles.detailValue}`}>Quantity: 1</div>
          <div className={`mt-[15px] ${styles.detailValue}`}>Product: T-Shirt / Medium / White</div>
        </div>

        <div>
          <div>
            <OutlineButton
              borderColor="var(--follow-btn-border-mobile)"
              width={335}
              label="Track package"
              onClick={() => {}}
            />
          </div>
          <div className="mt-[12px]">
            <OutlineButton
              borderColor="var(--follow-btn-border-mobile)"
              width={335}
              label="Get help"
              onClick={() => {}}
            />
          </div>
          <div className="mt-[12px]">
            <OutlineButton
              borderColor="var(--follow-btn-border-mobile)"
              width={335}
              label="Write a product review"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-[75px]">
        <div className={styles.infoValue}>Shipping Status: Awaiting Shipment</div>
      </div>
      <div className="w-full flex justify-center mt-[75px]">
        <div className={styles.separator}></div>
      </div>
    </div>
  )
}

export default MerchDetail

MerchDetail.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
