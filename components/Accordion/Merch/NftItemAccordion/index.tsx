import React, { useState } from 'react'

// third party components

// images and icons

// styles
import styles from './index.module.scss'
import MerchNftItem from 'components/Card/MerchNftItem'
import ThreeDotIcon from 'assets/icons/three-dot-icon.svg?component'
import StudioNftModal from 'components/Menu/StudioNftModal'

const NftItemAccordion = props => {
  const { data, type, action, actionAll } = props
  const [item, setItem] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className="w-full flex flex-wrap mt-[20px]">
      {data.map((item, index) => (
        <div key={index} className="w-full flex flex-wrap mt-[-4px]">
          <div className={styles.button}>
            <div className="flex items-center gap-x-4">
              <div className="w-[25px] h-[25px] rounded-[4px] overflow-hidden">
                <MerchNftItem width={54} height={54} url={item.asset_url} />
              </div>
              <div className="ml-[11px]">
                <div className={styles.title}>{item.nft_name}</div>
              </div>
            </div>
            <div
              onClick={() => {
                setItem(item)
                setOpenModal(true)
              }}
            >
              <ThreeDotIcon />
            </div>
          </div>
        </div>
      ))}

      {openModal && item && (
        <StudioNftModal open={openModal} close={() => setOpenModal(false)} item={item} type={type} action={action} />
      )}
    </div>
  )
}

export default NftItemAccordion
