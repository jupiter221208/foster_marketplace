import React, { useEffect } from 'react'

// components
import useAudioPlayer from './useAudioPlayer'
import AudioBar from 'components/MediaPlayer/MintAudioPlayer/AudioBar'

// custom functions

// styles
import styles from './index.module.scss'

const MintAudioPlayer = props => {
  const { src, type = 'single' } = props
  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer()

  useEffect(() => {
    const audio = document.getElementById('audio') as HTMLMediaElement
    audio.load()
  }, [src])

  return (
    <div
      className={`absolute bottom-0 ${
        type === 'single' ? 'lg:bottom-[15px]' : 'lg:bottom-[10px]'
      } left-0 lg:left-[18px] right-0 lg:right-[18px] z-10`}
    >
      <div className="">
        <audio id="audio">
          <source src={src} />
          Your browser does not support the <code>audio</code> element.
        </audio>
        <div className={type === 'single' ? styles.audioBG : styles.mintAudioBG}>
          <AudioBar
            playing={playing}
            onPlay={() => setPlaying(!playing)}
            curTime={curTime}
            duration={duration}
            onTimeUpdate={time => setClickedTime(time)}
          />
        </div>
      </div>
    </div>
  )
}

export default MintAudioPlayer
