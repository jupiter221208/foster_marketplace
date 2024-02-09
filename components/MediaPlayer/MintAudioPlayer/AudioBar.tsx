import React from 'react'

// third party components
import * as moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import PlayWhiteIcon from 'assets/icons/play-video-big.svg?component'
import PauseWhiteIcon from 'assets/icons/pause-video-big.svg?component'

import styles from './AudioBar.module.scss'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'

const Bar = props => {
  const { playing, onPlay, duration, curTime, onTimeUpdate } = props

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
    <div className={styles.container}>
      <div className="w-full flex justify-around items-center h-[31px] lg:h-[45px] lg:mb-[25px] mb-[20px] px-[10px] lg:px-[30px]">
        <span className={styles.time}>{formatDuration(curTime)}</span>

        <IconButtonWithSVG
          icon={playing ? <PauseWhiteIcon /> : <PlayWhiteIcon />}
          onClick={() => onPlay()}
          backgroundColor="transparent"
        />

        <span className={styles.time}>{formatDuration(duration)}</span>
      </div>

      <div className={styles.bar}>
        <div
          id="bar__progress"
          className={styles.bar__progress}
          style={{
            background: `linear-gradient(to right, var(--main-icon-color) ${curPercentage}%, rgba(var(--main-bg-color-rgb), 0.2) 0)`,
          }}
          onMouseDown={e => handleTimeDrag(e)}
        >
          <span className={styles.bar__progress__knob} style={{ left: `${curPercentage - 2}%` }} />
        </div>
      </div>
    </div>
  )
}

export default Bar
