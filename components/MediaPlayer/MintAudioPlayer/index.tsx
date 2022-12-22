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
import PlayWhiteIcon from 'assets/icons/play-white.svg'
import PauseWhiteIcon from 'assets/icons/pause-white.svg'
import BackwardWhiteIcon from 'assets/icons/backward-white.svg'
import ForwardWhiteIcon from 'assets/icons/forward-white.svg'

// styles
import styles from './index.module.scss'

const MintAudioPlayer = props => {
  const { src } = props

  const viewport = useViewport()

  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer()

  return (
    <div className="absolute bottom-5 left-4 lg:left-8 right-4 lg:right-8 z-10">
      <div className={styles.contentArea}>
        <audio id="audio">
          <source src={src} />
          Your browser does not support the <code>audio</code> element.
        </audio>
        <div className="flex items-center gap-1">
          <IconButton
            icon={BackwardWhiteIcon}
            onClick={() => setClickedTime(curTime - 15)}
            backgroundColor="transparent"
            width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '36px' : '20px'}
            height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '36px' : '20px'}
          />
          <IconButton
            icon={playing ? PauseWhiteIcon : PlayWhiteIcon}
            onClick={() => setPlaying(!playing)}
            backgroundColor="transparent"
            width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '46px' : '24px'}
            height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '46px' : '24px'}
          />
          <IconButton
            icon={ForwardWhiteIcon}
            onClick={() => setClickedTime(curTime + 15)}
            backgroundColor="transparent"
            width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '36px' : '20px'}
            height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '36px' : '20px'}
          />
        </div>
        <AudioBar curTime={curTime} duration={duration} onTimeUpdate={time => setClickedTime(time)} />
      </div>
    </div>
  )
}

export default MintAudioPlayer
