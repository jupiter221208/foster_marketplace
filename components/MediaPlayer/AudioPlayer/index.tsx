import React from 'react'

// next components
import Image from 'next/image'

// components
import IconButton from 'components/Button/IconButton'
import useAudioPlayer from './useAudioPlayer'
// import AudioBar from 'components/MediaPlayer/AudioPlayer/AudioBar'
import AudioBar from 'components/MediaPlayer/MintAudioPlayer/AudioBar'

// custom functions
import { useViewport } from 'utils'

// images and icons
import AudioPlayerBackground from 'assets/images/audio-player.png'
import ErrorMessageIcon from 'assets/icons/error-message-icon.svg?component'

// styles
import styles from './index.module.scss'

const AudioPlayer = props => {
  const { src, cover } = props
  const viewport = useViewport()

  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer()

  return (
    <div className={styles.container}>
      <div className={styles.bgView}>
        <div className={styles.imageArea}>
          <div className={styles.imageContent}>
            {cover.length > 0 ? (
              <img src={cover} alt="" className="lg:rounded-tl-6 w-full h-full object-contain" />
            ) : (
              <Image src={AudioPlayerBackground} alt="" />
            )}
          </div>
        </div>
      </div>

      <div className={styles.contentArea}>
        <audio id="audio">
          <source src={src} />
          Your browser does not support the <code>audio</code> element.
        </audio>
        {src ? (
          <>
            <AudioBar
              playing={playing}
              onPlay={() => setPlaying(!playing)}
              curTime={curTime}
              duration={duration}
              onTimeUpdate={time => setClickedTime(time)}
            />
          </>
        ) : (
          <>
            <div className={styles.errorMessage}>
              <ErrorMessageIcon />
              <div>Audio File Missing</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AudioPlayer
