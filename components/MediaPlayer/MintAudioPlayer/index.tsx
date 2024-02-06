import React, { useEffect } from 'react'

// components
import useAudioPlayer from './useAudioPlayer'
import AudioBar from 'components/MediaPlayer/MintAudioPlayer/AudioBar'

// custom functions
import { useViewport } from 'utils'

const MintAudioPlayer = props => {
  const { src } = props
  const viewport = useViewport()
  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer()

  useEffect(() => {
    const audio = document.getElementById('audio') as HTMLMediaElement
    audio.load()
  }, [src])

  return (
    <div className="absolute bottom-0 lg:bottom-2 left-0 lg:left-[53px] right-0 lg:right-[53px] z-10">
      <div className="">
        <audio id="audio">
          <source src={src} />
          Your browser does not support the <code>audio</code> element.
        </audio>
        <AudioBar
          playing={playing}
          onPlay={() => setPlaying(!playing)}
          curTime={curTime}
          duration={duration}
          onTimeUpdate={time => setClickedTime(time)}
        />
      </div>
    </div>
  )
}

export default MintAudioPlayer
