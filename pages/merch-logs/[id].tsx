import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SecondaryLayout from 'components/Layout/SecondaryLayout'

import styles from './index.module.scss'

const MerchDetail = () => {
  const router = useRouter()
  const { id } = router.query
  console.log('=========id========', id)
  return (
    <div className="w-full">
      <div className="flex gap-[15px]">
        <div></div>
        <div className={styles.orderTitle}>Order#&nbsp;{id}</div>
      </div>
    </div>
  )
}

export default MerchDetail

MerchDetail.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
