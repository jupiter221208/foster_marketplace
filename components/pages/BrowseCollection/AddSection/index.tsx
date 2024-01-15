import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

// components
import AddTokenModal from 'components/Modal/AddTokenModal'
import ImportEAModal from 'components/Modal/ImportEAModal'

// icons
import UploadIcon from 'assets/icons/upload-icon.svg?component'
import ImportIcon from 'assets/icons/import-icon.svg?component'
import CrossPlusIcon from 'assets/icons/cross-plus.svg?component'

// styles
import styles from './index.module.scss'

const AddSection = props => {
  const { collectionId, coverUrl, handleCollectionImport } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const [showAddTokenModal, setShowAddTokenModal] = useState(false)
  const [showImportEAModal, setShowImportEAModal] = useState(false)

  useEffect(() => {}, [])

  const uploadNew = () => {
    dispatch({ type: 'set', mintCollectionStep: 2 })
    dispatch({ type: 'set', collectionMintAddress: collectionId })
    dispatch({ type: 'set', collectionCoverUrl: coverUrl })
    router.push('/create/collection')
  }

  return (
    <div className={styles.container}>
      <div className="flex items-center mt-[34px] lg:mt-[40px]">
        <div className={styles.topic}>Add artwork to collection</div>
        <div className={`lg:block hidden ${styles.astro}`}>&nbsp;* </div>
      </div>
      <div className={styles.description}>Pick your preferred method for adding artwork to your collection</div>
      <div className="flex flex-wrap lg:justify-around gap-[10px] lg:gap-[30px] mt-[30px]">
        <div className={styles.button} onClick={() => uploadNew()}>
          <UploadIcon />
          Upload New
        </div>
        <div className={styles.button} onClick={() => setShowAddTokenModal(true)}>
          <CrossPlusIcon />
          Add Token IDs
        </div>
        <div className={styles.button} onClick={() => setShowImportEAModal(true)}>
          <ImportIcon />
          Import from EA
        </div>
      </div>

      <AddTokenModal
        open={showAddTokenModal}
        onClose={() => setShowAddTokenModal(false)}
        onImportMintList={mintList => {
          setShowAddTokenModal(false)
          handleCollectionImport({ mintList })
        }}
      />

      <ImportEAModal
        open={showImportEAModal}
        onClose={() => setShowImportEAModal(false)}
        onImportUrl={eaUrl => handleCollectionImport({ eaUrl })}
      />
    </div>
  )
}

export default AddSection
