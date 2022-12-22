import { useState, useEffect } from 'react'

const useAudioPlayer = () => {
  const [duration, setDuration] = useState<number>(0)
  const [curTime, setCurTime] = useState<number>(0)
  const [playing, setPlaying] = useState(false)
  const [clickedTime, setClickedTime] = useState(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = document.getElementById('audio') as HTMLMediaElement

    // state setters wrappers
    const setAudioData = () => {
      setDuration(audio.duration)
      setCurTime(audio.currentTime)
    }

    const setAudioTime = () => setCurTime(audio.currentTime)

    // DOM listeners: update React state on DOM events
    audio.addEventListener('loadeddata', setAudioData)

    audio.addEventListener('timeupdate', setAudioTime)

    // React state listeners: update DOM on React state changes
    playing ? audio.play() : audio.pause()
    audio.muted = muted

    if (clickedTime && clickedTime !== curTime) {
      audio.currentTime = clickedTime
      setClickedTime(null)
    }

    // effect cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
    }
  })

  return {
    curTime,
    duration,
    playing,
    setPlaying,
    setClickedTime,
    muted,
    setMuted,
  }
}

export default useAudioPlayer
