import React from 'react'

// next components

// components
import useAudioPlayer from './useAudioPlayer'
// import AudioBar from 'components/MediaPlayer/AudioPlayer/AudioBar'
import AudioBar from 'components/MediaPlayer/MintAudioPlayer/AudioBar'

// custom functions

// images and icons
import ErrorMessageIcon from 'assets/icons/error-message-icon.svg?component'

// styles
import styles from './index.module.scss'

const AudioPlayer = props => {
  const { src } = props

  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer()

  return (
    <div className={styles.container}>
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
