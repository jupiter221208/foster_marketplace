import React, { useState } from 'react'

// custom components
import GreenLineCard from 'components/Card/GreenLineCard'
import Switch from 'components/Switch'
import GradientButton from 'components/Button/GradientButton'

// styles
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'

import { setColorTheme } from 'utils/helpers'

const DisplayPreferences = prop => {
  const { success } = prop
  const dispatch = useDispatch()

  const [apperance, setApperance] = useState(false)
  const [defaultProfile, setDefaultProfile] = useState(true)
  const [lightMode, setLightMode] = useState(useSelector(state => (state as any).lightMode)) // =

  const handleThemeMode = () => {
    const doc = document.documentElement
    setColorTheme(!lightMode)
    dispatch({ type: 'set', lightMode: !lightMode })
    setLightMode(!lightMode)
  }

  return (
    <div className={styles.container}>
      <div className="w-full flex justify-center">
        <div className={styles.content}>
          <div className="w-full mt-[10px] mb-12">
            <GreenLineCard content="Your display preferences allow you to manage your font color, background, and how others discover your artwork and collections." />
          </div>
          <div className="w-full flex flex-wrap gap-12 mb-[60px] lg:mb-[94px]">
            <Switch
              title="Application Appearance"
              description="Choose between dark mode and light mode"
              current={lightMode ? 'Currently Selected: Light Mode' : 'Currently Selected: Dark Mode'}
              enabled={lightMode}
              onChange={handleThemeMode}
            />
            <Switch
              title="Default Profile Display"
              description="Select whether you are primarily an artist or collector"
              current={defaultProfile ? 'Currently Selected: Artist' : 'Currently Selected: Collector'}
              enabled={defaultProfile}
              onChange={() => setDefaultProfile(!defaultProfile)}
            />
          </div>
          {/* <div className="w-full flex justify-end mb-20">
            <GradientButton
              label="Save"
              onClick={() => {
                success()
              }}
              height="53px"
              paddingLeft="41px"
              paddingRight="41px"
              fontSize="18px"
            />
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default DisplayPreferences
