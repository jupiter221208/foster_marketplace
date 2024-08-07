import React, { useState } from 'react'

// resources
import ArrowRightWhiteIcon from 'assets/icons/arrow-right-white-medium.svg?component'
import ArrowDownWhiteIcon from 'assets/icons/arrow-down-white.svg?component'

// styles
import styles from './index.module.scss'

// api

const NFTCategorySection = props => {
  const { nftCategories } = props
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="w-full mt-[15px]">
      <div className="w-full flex justify-between" onClick={() => setShowDetails(!showDetails)}>
        <div className={styles.details}>Categories</div>
        <div>{showDetails ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />}</div>
      </div>

      {showDetails && (
        <div>
          {nftCategories?.length > 0 ? (
            <div className="w-full flex flex-wrap justify-start items-center mt-[15px] gap-[10px]">
              {nftCategories?.map((item, index) => (
                <div className={styles.category} key={index}>
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noCategory}>This artwork has no category attributes</div>
          )}
        </div>
      )}
      <div className={styles.descBorder} />
    </div>
  )
}

export default NFTCategorySection
