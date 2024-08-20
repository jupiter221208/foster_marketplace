import React, { useState } from 'react'

// styles
import styles from './index.module.scss'

// api

const NFTCategorySection = props => {
  const { nftCategories } = props
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="w-full mt-[30px]">
      <div className={styles.details}>Categories</div>

      <div className={styles.descBorder} />

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
    </div>
  )
}

export default NFTCategorySection
