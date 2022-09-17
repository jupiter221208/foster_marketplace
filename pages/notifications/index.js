import React from 'react'

// next images
import Image from 'next/image'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import NotificationsSearchBox from 'components/Input/NotificationsSearchBox'
import NotificationsCard from 'components/Card/NotificationsCard'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'

// styles
import styles from './index.module.scss'

const Notifications = props => {
  const { viewport } = props

  return (
    <div className="g-container">
      <div className={styles.container}>
        <div className={styles.topLeftEllipse}>
          <Image src={EllipseGreen} alt="" objectFit="cover" />
        </div>
        <div className="w-full z-10">
          <div className={styles.title}>Notifications</div>
        </div>
        <div className="w-full flex justify-between mt-[38px]">
          <div className="w-full flex flex-wrap max-w-[670px] gap-[35px] z-10">
            <NotificationsSearchBox placeholder="Search by keywords" />
            <NotificationsCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications

Notifications.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
