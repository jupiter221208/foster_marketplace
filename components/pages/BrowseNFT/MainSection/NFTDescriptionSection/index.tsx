import React, { useRef, useState } from 'react'

// resources
import ArrowRightWhiteIcon from 'assets/icons/arrow-right-white-medium.svg?component'
import ArrowDownWhiteIcon from 'assets/icons/arrow-down-white.svg?component'

// styles
import styles from './index.module.scss'

const NFTDescriptionSection = props => {
  const { isTruncated, processedNftDescription, tempNftDescription, shouldShowReadMore, toggleIsTruncated } = props
  const descriptionViewRef = useRef(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="w-full mt-[30px]">
      <div className="w-full flex justify-between items-center" onClick={() => setShowDetails(!showDetails)}>
        <div className={styles.details}>Description</div>
        <div>{showDetails ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />}</div>
      </div>

      {showDetails &&
        (tempNftDescription.length > 0 ? (
          <div className={`w-full h-[auto] mt-[15px]`}>
            <div className={styles.whiteDescription}>
              <div
                ref={descriptionViewRef}
                className={`lg:block hidden  ${isTruncated ? 'max-h-[180px]' : 'max-h-[220px] overflow-auto'}`}
              >
                {processedNftDescription}
                {shouldShowReadMore && (
                  <span
                    onClick={() => {
                      descriptionViewRef.current.scrollTop = 0

                      toggleIsTruncated()
                    }}
                    className={`${styles.greenText} min-w-max cursor-pointer`}
                  >
                    {isTruncated ? '... Expand' : ' Collapse'}
                  </span>
                )}
              </div>
              <div className="lg:hidden block">{tempNftDescription}</div>
            </div>
          </div>
        ) : isLoaded ? (
          <div className={styles.noCategory}>No description for this artwork.</div>
        ) : (
          <></>
        ))}

      <div className={styles.descBorder} />
    </div>
  )
}

export default NFTDescriptionSection
