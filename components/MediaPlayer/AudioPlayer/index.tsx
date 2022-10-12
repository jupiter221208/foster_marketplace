import React from 'react'

// next components
import Image from 'next/image'

// components
import IconButton from 'components/Button/IconButton'
import useAudioPlayer from './useAudioPlayer'
import Bar from './bar'

// images and icons
import AudioPlayerBackground from 'assets/images/audio-player.png'
import PlayWhiteIcon from 'assets/icons/play-white.svg'
import PauseWhiteIcon from 'assets/icons/pause-white.svg'
import BackwardWhiteIcon from 'assets/icons/backward-white.svg'
import ForwardWhiteIcon from 'assets/icons/forward-white.svg'

// styles
import styles from './index.module.scss'

const AudioPlayer = props => {
  const { src, cover } = props
  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer()

  return (
    <div className={styles.container}>
      {cover.length > 0 ? <img src={cover} width="100%" alt="" /> : <Image src={AudioPlayerBackground} alt="" />}

      <div className="absolute bottom-[45px] left-9 right-9 z-10">
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
              width="36px"
              height="36px"
            />
            <IconButton
              icon={playing ? PauseWhiteIcon : PlayWhiteIcon}
              onClick={() => setPlaying(!playing)}
              backgroundColor="transparent"
            />
            <IconButton
              icon={ForwardWhiteIcon}
              onClick={() => setClickedTime(curTime + 15)}
              backgroundColor="transparent"
              width="36px"
              height="36px"
            />
          </div>
          <Bar curTime={curTime} duration={duration} onTimeUpdate={time => setClickedTime(time)} />
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
