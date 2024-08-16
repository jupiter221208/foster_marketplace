import React, { useEffect, useState } from 'react'

// components
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// styles
import styles from './index.module.scss'

const MobileProfileFilter = props => {
  const { listingStatus, listingType, ownership, studio, onClose, onFilter } = props

  const [selectedListing, setSelectedListing] = useState(null)
  const [listingStatusList, setListingStatusList] = useState<any>(listingStatus)
  const [listingTypeList, setListingTypeList] = useState<any>(listingType)
  const [ownershipList, setOwnershipList] = useState<any>(ownership)
  const [studioList, setStudioList] = useState<any>(studio)
  console.log(listingStatus, listingType, ownership, studio)
  useEffect(() => {
    listingStatusList.map(item => {
      if (item.checked) setSelectedListing(item)
    })
  }, [listingStatusList])

  const handleSelectListingStatus = index => {
    let array = [...listingStatusList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setListingStatusList(array)
  }

  const handleSelectListingType = index => {
    let array = [...listingTypeList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setListingTypeList(array)
  }

  const handleSelectOwnership = index => {
    let array = [...ownershipList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setOwnershipList(array)
  }

  const handleSelectStudio = index => {
    let array = [...studioList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setStudioList(array)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>Listing Status</div>
        {listingStatusList.map((item, index) => (
          <div id={`check-label-${index}`} key={index} className="flex justify-between my-[8px]">
            <label
              className={`${styles.checkmark}`}
              onClick={() => {
                handleSelectListingStatus(index)
              }}
            >
              {item.name}
            </label>
            <input
              className={`${styles.checkbox}`}
              type="checkbox"
              id={item.id}
              checked={item.checked}
              onChange={() => {
                handleSelectListingStatus(index)
              }}
            />
          </div>
        ))}

        {(selectedListing?.id === 0 || selectedListing?.id === 2) && (
          <div>
            <div className={styles.title}>Listing Type</div>
            {listingTypeList.map((item, index) => (
              <div id={`check-label-${index}`} key={index} className="flex justify-between my-[8px]">
                <label
                  className={`${styles.checkmark}`}
                  onClick={() => {
                    handleSelectListingType(index)
                  }}
                >
                  {item.name}
                </label>
                <input
                  className={`${styles.checkbox}`}
                  type="checkbox"
                  id={item.id}
                  checked={item.checked}
                  onChange={() => {
                    handleSelectListingType(index)
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className={styles.title}>Ownership</div>
        {ownershipList.map((item, index) => (
          <div id={`check-label-${index}`} key={index} className="flex justify-between my-[8px]">
            <label
              className={`${styles.checkmark}`}
              onClick={() => {
                handleSelectOwnership(index)
              }}
            >
              {item.name}
            </label>
            <input
              className={`${styles.checkbox}`}
              type="checkbox"
              id={item.id}
              checked={item.checked}
              onChange={() => {
                handleSelectOwnership(index)
              }}
            />
          </div>
        ))}

        <div className={styles.title}>Studio</div>
        {studioList.map((item, index) => (
          <div id={`check-label-${index}`} key={index} className="flex justify-between my-[8px]">
            <label
              className={`${styles.checkmark}`}
              onClick={() => {
                handleSelectStudio(index)
              }}
            >
              {item.name}
            </label>
            <input
              className={`${styles.checkbox}`}
              type="checkbox"
              id={item.id}
              checked={item.checked}
              onChange={() => {
                handleSelectStudio(index)
              }}
            />
          </div>
        ))}
      </div>
      <div className={styles.bottomArea}>
        <div className="w-[94px]">
          <OutlineButton
            label="Cancel"
            onClick={() => onClose()}
            color="var(--text-gray-200-color)"
            borderWidth={1}
            fontSize={16}
            borderColor="rgba(#ffffff, 0.5)"
            fullWidth
            height={40}
          />
        </div>
        <div className="w-[94px]">
          <GradientButton
            label="Apply"
            height={40}
            fontSize={16}
            backgroundColor01="var(--main-icon-color)"
            backgroundColor02="var(--main-icon-color)"
            color="var(--background-main-color)"
            onClick={() =>
              onFilter({
                listingStatus: listingStatusList,
                listingType: listingTypeList,
                ownership: ownershipList,
                studio: studioList,
              })
            }
            fullWidth
          />
        </div>
      </div>
    </div>
  )
}

export default MobileProfileFilter
