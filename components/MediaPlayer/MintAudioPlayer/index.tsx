import React, { useEffect } from 'react'

// components
import IconButton from 'components/Button/IconButton'
import useAudioPlayer from './useAudioPlayer'
import AudioBar from 'components/MediaPlayer/MintAudioPlayer/AudioBar'

// custom functions
import { useViewport } from 'utils'

// images and icons
import PlayWhiteIcon from 'assets/icons/play-video.svg'
import PauseWhiteIcon from 'assets/icons/pause-video.svg'

const MintAudioPlayer = props => {
  const { src } = props
  const viewport = useViewport()
  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer()

  useEffect(() => {
    const audio = document.getElementById('audio') as HTMLMediaElement
    audio.load()
  }, [src])

  return (
    <div className="absolute bottom-2 left-4 lg:left-8 right-4 lg:right-8 z-10">
      <div className="flex justify-between">
        <audio id="audio">
          <source src={src} />
          Your browser does not support the <code>audio</code> element.
        </audio>
        <IconButton
          icon={playing ? PauseWhiteIcon : PlayWhiteIcon}
          onClick={() => setPlaying(!playing)}
          backgroundColor="transparent"
          width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '46px' : '24px'}
          height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '46px' : '24px'}
          iconWidth="9px"
          iconHeight="10px"
        />
        <AudioBar curTime={curTime} duration={duration} onTimeUpdate={time => setClickedTime(time)} />
        {/* <IconButton
          icon={muted ? AudioUnmuteWhiteIcon : AudioMuteWhiteIcon}
          onClick={() => setMuted(!muted)}
          backgroundColor="transparent"
          width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '46px' : '24px'}
          height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '46px' : '24px'}
        /> */}
      </div>
    </div>
  )
}

export default MintAudioPlayer
