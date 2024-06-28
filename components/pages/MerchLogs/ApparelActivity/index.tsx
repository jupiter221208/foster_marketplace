import React, { useEffect, useState } from 'react'

// components
import TableSections from './TableSection'
import CreatorSearchSection from '../CreatorSearchSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// functions

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import { useRouter } from 'next/router'

const ApparelActivity = props => {
  const { activities, pendingList, allList, type, isLoading } = props
  const router = useRouter()

  return (
    <div className={styles.container}>
      {activities.length > 0 && (
        <div className="mt-[10px]">
          <TableSections data={activities} type={type} />
        </div>
      )}

      {!isLoading && activities?.length === 0 && (
        <div className="w-full mt-[50px] lg:mt-[0px]">
          {type === 'purchases' ? (
            <div className="w-full mt-[50px] lg:mt-[0px]">
              <div className={styles.noArtwork}>No order history detected</div>
              <div className={styles.text}>Explore merch from your favorite artists </div>
              <div className="w-full flex justify-center mt-[30px]">
                <GradientButton
                  label="Shop Studio"
                  width={144}
                  height={54}
                  borderRadius={30}
                  onClick={() => router.push('/studio')}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.noArtwork}>No results found</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ApparelActivity
