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
        pointStyle: 'circle',
        pointRadius: 0,
        pointBackgroundColor: 'transparent',
        pointHoverRadius: 6,
        pointHoverBorderWidth: 12,
        pointHoverBorderColor: 'rgba(90, 195, 186, 0.3)',
        pointHoverBackgroundColor: '#5AC3BA',
      },
    ],
  }

  // <block:external:2>
  const getOrCreateTooltip = chart => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div')

    if (!tooltipEl) {
      tooltipEl = document.createElement('div')
      tooltipEl.style.background =
        'linear-gradient(to bottom, rgba(2, 2, 2, 100%),rgba(10, 12, 11, 100%) 70%, rgba(20, 26, 23, 100%))'
      tooltipEl.style.borderRadius = '6px'
      tooltipEl.style.border = '1px solid #5AC3BA'
      tooltipEl.style.color = 'white'

      tooltipEl.style.opacity = 1
      tooltipEl.style.pointerEvents = 'none'
      tooltipEl.style.position = 'absolute'
      tooltipEl.style.transform = 'translate(-50%, 0)'
      tooltipEl.style.transition = 'all .3s ease'

      tooltipEl.style.display = 'block'

      const table = document.createElement('table')
      table.style.margin = '0px'

      const arrowArea = document.createElement('div')
      arrowArea.style.width = '100%'
      arrowArea.style.display = 'flex'
      arrowArea.style.bottom = '-20px'
      arrowArea.style.justifyContent = 'center'
      arrowArea.style.backgroundColor = 'green'
      arrowArea.style.zIndex = '999'
      arrowArea.style.height = '0px'

      const arrow = document.createElement('div')
      arrow.style.position = 'absolute'
      arrow.style.bottom = '-20px'
      arrow.style.borderLeft = '20px solid transparent'
      arrow.style.borderRight = '20px solid transparent'
      arrow.style.borderTop = '20px solid #5AC3BA'
      arrow.style.zIndex = '1000'

      const contentArrow = document.createElement('div')
      contentArrow.style.position = 'relative'
      contentArrow.style.bottom = '-6px'
      contentArrow.style.left = '0px'
      contentArrow.style.borderLeft = '18px solid transparent'
      contentArrow.style.borderRight = '18px solid transparent'
      contentArrow.style.borderTop = '18px solid rgba(20, 26, 23, 100%)'
      contentArrow.style.zIndex = '1001'

      arrowArea.appendChild(arrow)
      arrowArea.appendChild(contentArrow)

      tooltipEl.appendChild(table)
      tooltipEl.appendChild(arrowArea)
      chart.canvas.parentNode.appendChild(tooltipEl)
    }

    return tooltipEl
  }

  const externalTooltipHandler = context => {
    // Tooltip Element
    const { chart, tooltip } = context
    const tooltipEl = getOrCreateTooltip(chart)

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0
      return
    }

    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || []
      const bodyLines = tooltip.body.map(b => b.lines)

      const tableHead = document.createElement('thead')

      // title part
      const tr = document.createElement('tr')
      tr.style.borderWidth = '0px'

      const th = document.createElement('th')
      th.style.borderWidth = '0px'

      const titleDiv = document.createElement('div')
      titleDiv.style.color = '#ffffff'
      titleDiv.style.fontSize = '12px'
      titleDiv.style.fontFamily = 'Muli-SemiBold'
      const title = document.createTextNode('Daily Volume')
      titleDiv.appendChild(title)

      th.appendChild(titleDiv)
      tr.appendChild(th)
      tableHead.appendChild(tr)

      const tableBody = document.createElement('tbody')
      bodyLines.forEach((body, i) => {
        const tr = document.createElement('tr')
        tr.style.backgroundColor = 'inherit'
        tr.style.borderWidth = '0px'

        const td = document.createElement('td')
        td.style.borderWidth = '0px'
        td.style.display = 'flex'

        const convertDate = inputFormat => {
          function pad(s) {
            return s < 10 ? '0' + s : s
          }
          var d = new Date(inputFormat)
          return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
        }

        const dateDiv = document.createElement('div')
        dateDiv.style.color = '#B7B9B9'
        dateDiv.style.fontSize = '14px'
        dateDiv.style.fontFamily = 'Muli-Regular'

        const date = document.createTextNode(convertDate(new Date(titleLines[0])))
        dateDiv.appendChild(date)
        const solanaIcon = document.createElement('img')
        solanaIcon.src = '/icons/solana-logo.svg'
        solanaIcon.alt = 'solana-logo'
        solanaIcon.width = 15
        solanaIcon.height = 15
        solanaIcon.style.marginLeft = '14px'
        solanaIcon.style.marginRight = '4px'

        const volumeDiv = document.createElement('div')
        volumeDiv.style.color = '#5AC3BA'
        volumeDiv.style.fontSize = '14px'
        volumeDiv.style.fontFamily = 'Muli-Regular'

        const volume = document.createTextNode(body)
        volumeDiv.appendChild(volume)

        td.appendChild(dateDiv)
        td.appendChild(solanaIcon)
        td.appendChild(volumeDiv)
        tr.appendChild(td)
        tableBody.appendChild(tr)
      })

      const tableRoot = tooltipEl.querySelector('table')

      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove()
      }

      // Add new children
      tableRoot.appendChild(tableHead)
      tableRoot.appendChild(tableBody)
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1
    tooltipEl.style.left = positionX + tooltip.caretX + 'px'
    tooltipEl.style.top = positionY + tooltip.caretY - 80 + 'px'
    tooltipEl.style.font = tooltip.options.bodyFont.string
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px'
  }
  // </block:external>

  const lineOptions = {
    responsive: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
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
        enabled: false,
        position: 'nearest',
        external: externalTooltipHandler,
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
      <div className="z-10">
        <Line
          ref={myChartRef}
          options={lineOptions as any}
          data={data as any}
          height="350px"
          width="1500px"
          className="z-10"
        ></Line>
      </div>
      <div className="absolute inset-1/2 -mt-[130px] -ml-[112px] w-[224px] h-[258px] z-0">
        <Image src={LogoGray} alt="" width={224} height={258} />
      </div>
    </div>
  )
}

export default Chart
