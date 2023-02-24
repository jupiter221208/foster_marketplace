import React, { useState } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

// components
import IconButton from 'components/Button/IconButton'
import Radio from 'components/Radio'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// json
import ProfileList from 'assets/json/explore/profile.json'
import ArtistVerificationList from 'assets/json/explore/artist-verification.json'

// styles
import styles from './index.module.scss'

const MobileEcosystemFilter = props => {
  const { onClose } = props
  const [selectedProfile, setSelectedProfile] = useState(ProfileList[0])
  const [selectedVerifyType, setSelectedVerifyType] = useState(ArtistVerificationList[2])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className="w-full flex justify-between items-center mb-8">
          <div className={styles.title}>Filters</div>
          <div className="-mr-3">
            <IconButton icon={CloseWhiteIcon} onClick={() => onClose()} />
          </div>
        </div>
        {/* <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between">
                <div className={styles.subTitle}>PROFILE</div>
                <ChevronUpIcon
                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
                  style={{ color: '#DEEFD0' }}
                />
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
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px]`}>VERIFICATION STATUS</div>
                <ChevronUpIcon
                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
                  style={{ color: '#DEEFD0' }}
                />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio
                  data={ArtistVerificationList}
                  selected={selectedVerifyType}
                  onChange={item => setSelectedVerifyType(item)}
                  direction="rtl"
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
