import React from 'react'

// third party components
import * as moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

import styles from './bar.module.scss'

const Bar = props => {
  const { duration, curTime, onTimeUpdate } = props

  const curPercentage = (curTime / duration) * 100

  const formatDuration = (duration: number) => {
    momentDurationFormatSetup(moment)
    return moment.duration(duration, 'seconds').format('mm:ss', { trim: false })
  }

  const calcClickedTime = (e: any) => {
    const clickPositionInPage = e.pageX
    const bar = document.getElementById('bar__progress')!
    const barStart = (bar.getBoundingClientRect().left || 0) + window.scrollX
    const barWidth = bar.offsetWidth
    const clickPositionInBar = clickPositionInPage - barStart
    const timePerPixel = duration / barWidth
    return timePerPixel * clickPositionInBar
  }

  const handleTimeDrag = (e: any) => {
    onTimeUpdate(calcClickedTime(e))

    const updateTimeOnMove = eMove => {
      onTimeUpdate(calcClickedTime(eMove))
    }

    document.addEventListener('mousemove', updateTimeOnMove)

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', updateTimeOnMove)
    })
  }

  return (
    <div className={styles.bar}>
      <span className={styles.bar__time}>{formatDuration(curTime)}</span>
      <div
        id="bar__progress"
        className={styles.bar__progress}
        style={{
          background: `linear-gradient(to right, #173639 ${curPercentage}%, #495463 0)`,
        }}
        onMouseDown={e => handleTimeDrag(e)}
      >
        <span className={styles.bar__progress__knob} style={{ left: `${curPercentage - 2}%` }} />
      </div>
      <span className={styles.bar__time}>{formatDuration(duration)}</span>
    </div>
  )
}

export default Bar
