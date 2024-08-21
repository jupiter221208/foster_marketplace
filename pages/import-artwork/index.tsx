import React, { useEffect, useState } from 'react'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'

// styles
import styles from './index.module.scss'

const ImportArtwork = () => {
  return (
    <div className="g-container">
      <div className={styles.title}>Import Artwork</div>
      <div className={styles.desc}>Import your artworks minted on other platforms.</div>
    </div>
  )
}

export default ImportArtwork

ImportArtwork.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
