import React, { useEffect, useRef, useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import 'chartjs-adapter-moment'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TimeScale,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import faker from 'faker'
import moment from 'moment'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, TimeScale)

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'

// json
import CategoryList from 'assets/json/popular-category.json'
import ChartTotalVolume from 'assets/json/stats/chart-total-volume.json'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import LogoGray from 'assets/icons/logo-gray.svg'

// styles
import styles from './index.module.scss'

const ViewChart = props => {
  const { viewport } = props

  const router = useRouter()
  const id = router.query['id']

  const myChartRef = useRef()

  useEffect(() => {
    if (myChartRef.current !== undefined) {
      myChartRef.current.ctx.shadowColor = '#DEEFD0'
      myChartRef.current.ctx.shadowBlur = 15
      myChartRef.current.ctx.shadowOffsetX = 1
      myChartRef.current.ctx.shadowOffsetY = 8
    }
  }, [myChartRef])

  const data = {
    labels: [moment().subtract(7, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    datasets: [
      {
        fill: true,
        data: ChartTotalVolume,
        borderWidth: 4,
        borderColor: '#DEEFD0',
        backgroundColor: 'transparent',
        borderJoinStyle: 'bevel',
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          // title: function (t, d) {
          //   return moment(d.labels[t[0].index]).format('dd MMM DD, YYYY')
          // },
          // label: function (t, d) {
          //   const label = d.datasets[t.datasetIndex].label
          //   const value = d.datasets[t.datasetIndex].data[t.index]
          //   const sign = value >= 0 ? '+' : ''
          //   return `${label}: ${sign}${value.toFixed(2)}%`
          // },
          // title: 'aaaa',
          // label: 'bbbb',
        },
      },
    },
    maintainAspectRatio: true,
    elements: {
      line: {
        tension: 0.5, // disables bezier curves
      },
      point: {
        radius: 1,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'MMM',
          },
        },
        ticks: {
          color: '#EFF0F6',
        },
        grid: {
          color: 'transparent',
        },
        gridLines: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#6A8172',
          borderDash: [5, 10],
          drawBorder: true,
        },
        max: 1000,
        min: 0,
        ticks: {
          color: '#EFF0F6',
          stepSize: 100,
        },
      },
    },
    type: 'line',
  }

  return (
    <div className="g-container">
      <div className={styles.container}>
        <div className={styles.topLeftEllipse}>
          <Image src={EllipseGreen} alt="" objectFit="cover" />
        </div>
        <div className="w-full flex relative">
          <Line ref={myChartRef} options={lineOptions} data={data} height="700px" width="1500px" className="z-10" />
          <div className="absolute inset-1/2 -mt-[130px] -ml-[112px] w-[224px] h-[258px] z-0">
            <Image src={LogoGray} alt="" width={224} height={258} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewChart

ViewChart.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
