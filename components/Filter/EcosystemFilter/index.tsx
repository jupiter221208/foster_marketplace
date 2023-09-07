import React, { useState } from 'react'

// components
import Radio from 'components/Radio'

// json
import ArtistVerificationList from 'assets/json/explore/artist-verification.json'

// styles
import styles from './index.module.scss'

const EcosystemFilter = () => {
  const [selectedVerifyType, setSelectedVerifyType] = useState(ArtistVerificationList[2])

  return (
    <div className={styles.container}>
      {/* <div className={styles.title}>PROFILE</div>
      <Radio data={ProfileList} selected={selectedProfile} onChange={item => setSelectedProfile(item)} /> */}
      <div className={styles.title}>Verification Status</div>
      <Radio
        data={ArtistVerificationList}
        selected={selectedVerifyType}
        onChange={item => setSelectedVerifyType(item)}
      />
    </div>
  )
}

export default EcosystemFilter
