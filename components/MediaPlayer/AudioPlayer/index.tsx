import React from 'react'

// next components
import Image from 'next/image'

// components
import IconButton from 'components/Button/IconButton'
import useAudioPlayer from './useAudioPlayer'
import Play from './Play'
import Pause from './Pause'
import Bar from './bar'

// images and icons
import AudioPlayerBackground from 'assets/images/audio-player.png'
import PlayWhiteIcon from 'assets/icons/play-white.svg'

// styles
import styles from './index.module.scss'

const AudioPlayer = props => {
  const { src } = props
  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer()
  return (
    <div className={styles.container}>
      <Image src={AudioPlayerBackground} alt="" />
      <div className="absolute bottom-[45px] left-9 right-9 z-10">
        <div className={styles.contentArea}>
          <audio id="audio">
            <source src="./song.mp3" />
            Your browser does not support the <code>audio</code> element.
          </audio>
          {playing ? (
            <IconButton icon={PlayWhiteIcon} handleClick={() => setPlaying(false)} />
          ) : (
            <IconButton icon={PlayWhiteIcon} handleClick={() => setPlaying(true)} />
          )}
          {/* <Bar curTime={curTime} duration={duration} onTimeUpdate={time => setClickedTime(time)} /> */}
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
