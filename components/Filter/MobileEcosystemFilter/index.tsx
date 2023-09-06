import React, { useState } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'

// components
import Radio from 'components/Radio'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// images and icons

// json
import ArtistVerificationList from 'assets/json/explore/artist-verification.json'
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

// styles
import styles from './index.module.scss'

const MobileEcosystemFilter = props => {
  const { onClose } = props

  const [selectedVerifyType, setSelectedVerifyType] = useState(ArtistVerificationList[2])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between">
                <div className={styles.subTitle}>PROFILE</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio
                  data={ProfileList}
                  selected={selectedProfile}
                  onChange={item => setSelectedProfile(item)}
                  direction="rtl"
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure> */}
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px]`}>VERIFICATION STATUS</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio
                  data={ArtistVerificationList}
                  selected={selectedVerifyType}
                  onChange={item => setSelectedVerifyType(item)}
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
      <div className={styles.bottomArea}>
        <div className="w-[94px]">
          <OutlineButton
            label="Cancel"
            onClick={() => onClose()}
            color="#EFF0F6"
            borderWidth={2}
            borderColor="#5AC3BA"
            fullWidth
          />
        </div>
        <div className="w-[94px]">
          <GradientButton label="Done" onClick={() => onClose()} color="#202427" fullWidth />
        </div>
      </div>
    </div>
  )
}

export default MobileEcosystemFilter
