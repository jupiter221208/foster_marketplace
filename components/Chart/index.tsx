import React, { useEffect, useRef } from 'react'

// next components
import Image from 'next/image'

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
import moment from 'moment'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, TimeScale)

// images and icons
import LogoGray from 'assets/icons/logo-gray.svg'

const Chart = props => {
  const { list } = props

  const myChartRef = useRef<any>()

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
        data: list,
        borderWidth: 4,
        borderColor: '#DEEFD0',
        backgroundColor: 'transparent',
        borderJoinStyle: 'bevel',
      },
    ],
  }

  const lineOptions = {
    responsive: false,
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
          stepSize: 125,
        },
      },
    },
    type: 'line',
  }

  return (
    <div className="w-full flex relative">
      <Line
        ref={myChartRef}
        options={lineOptions as any}
        data={data as any}
        height="350px"
        width="1500px"
        className="z-10"
      />
      <div className="absolute inset-1/2 -mt-[130px] -ml-[112px] w-[224px] h-[258px] z-0">
        <Image src={LogoGray} alt="" width={224} height={258} />
      </div>
    </div>
  )
}

export default Chart
