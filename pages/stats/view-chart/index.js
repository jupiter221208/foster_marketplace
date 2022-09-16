import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import Chart from 'components/Chart'

// json
import CategoryList from 'assets/json/popular-category.json'
import ChartTotalVolume from 'assets/json/stats/chart-total-volume.json'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'

// styles
import styles from './index.module.scss'

const ViewChart = props => {
  const { viewport } = props

  const router = useRouter()
  const id = router.query['id']

  return (
    <div className="g-container">
      <div className={styles.container}>
        <div className={styles.topLeftEllipse}>
          <Image src={EllipseGreen} alt="" objectFit="cover" />
        </div>
        <div className="w-full">
          <Chart list={ChartTotalVolume} />
        </div>
      </div>
    </div>
  )
}

export default ViewChart

ViewChart.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
