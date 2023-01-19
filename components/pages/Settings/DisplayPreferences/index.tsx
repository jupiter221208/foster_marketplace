import React, { useState } from 'react'

// custom components
import GreenLineCard from 'components/Card/GreenLineCard'
import Switch from 'components/Switch'
import GradientButton from 'components/Button/GradientButton'

// styles
import styles from './index.module.scss'

const DisplayPreferences = prop => {
  const { success } = prop

  const [apperance, setApperance] = useState(false)
  const [defaultProfile, setDefaultProfile] = useState(true)

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
              current={apperance ? 'Currently Selected: Light Mode' : 'Currently Selected: Dark Mode'}
              enabled={apperance}
              onChange={() => setApperance(!apperance)}
            />
            <Switch
              title="Default Profile Display"
              description="Select whether you are primarily an artist or collector"
              current={defaultProfile ? 'Currently Selected: Artist' : 'Currently Selected: Collector'}
              enabled={defaultProfile}
              onChange={() => setDefaultProfile(!defaultProfile)}
            />
          </div>
          <div className="w-full flex justify-end mb-20">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisplayPreferences
