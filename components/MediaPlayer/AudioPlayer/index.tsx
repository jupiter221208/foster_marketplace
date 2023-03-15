import React from 'react'

// next components
import Image from 'next/image'

// components
import IconButton from 'components/Button/IconButton'
import useAudioPlayer from './useAudioPlayer'
import AudioBar from 'components/MediaPlayer/AudioPlayer/AudioBar'

// custom functions
import { useViewport } from 'utils'

// images and icons
import AudioPlayerBackground from 'assets/images/audio-player.png'
import BackwardWhiteIcon from 'assets/icons/backward-white.svg'
import ForwardWhiteIcon from 'assets/icons/forward-white.svg'
import PlayWhiteIcon from 'assets/icons/play-video-border.svg'
import PauseWhiteIcon from 'assets/icons/pause-video.svg'

// styles
import styles from './index.module.scss'
import MintAudioPlayer from '../MintAudioPlayer'

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
        <div className={styles.playButton}>
          <IconButton
            icon={playing ? PauseWhiteIcon : PlayWhiteIcon}
            onClick={() => setPlaying(!playing)}
            backgroundColor="transparent"
            width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '46px' : '20px'}
            height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '46px' : '20px'}
          />
        </div>
        <AudioBar curTime={curTime} duration={duration} onTimeUpdate={time => setClickedTime(time)} />
      </div>
    </div>
  )
}

export default AudioPlayer
