import React, { useEffect, useState } from 'react'

// components
import TableSections from './TableSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// functions

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import { useRouter } from 'next/router'
import MerchShopUpdateModal from 'components/Modal/MerchShopUpdateModal'
import MerchShopEditModal from 'components/Modal/MerchShopEditModal'

const MerchStoreActivity = props => {
  const { storeList, isLoading, username, userId, reloadMerchStore } = props
  const router = useRouter()
  const [selectedCard, seSelectedCard] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editType, setEditType] = useState('')

  const onUpdateMerch = data => {
    seSelectedCard(data)
    setShowUpdateModal(true)
  }

  const onDelistMerch = data => {
    seSelectedCard(data)
    setEditType('delist')
    setShowEditModal(true)
  }

  const onCancelMerch = data => {
    seSelectedCard(data)
    setEditType('cancel')
    setShowEditModal(true)
  }

  const onSuccess = () => {
    setShowEditModal(false)
    reloadMerchStore()
  }

  const onSuccessUpdate = () => {
    setShowUpdateModal(false)
    reloadMerchStore()
  }
  return (
    <div className={styles.container}>
      {storeList.length > 0 && (
        <div className="mt-[10px]">
          <TableSections
            username={username}
            data={storeList}
            onUpdate={data => onUpdateMerch(data)}
            onDelist={data => onDelistMerch(data)}
            onCancel={data => onCancelMerch(data)}
          />
        </div>
      )}

      {!isLoading && storeList?.length === 0 && (
        <div className="w-full mt-[50px] lg:mt-[0px]">
          <div className={styles.noArtwork}>Your merch store is empty.</div>
          <div className={styles.text}>Ready to design?</div>
          <div className="w-full flex justify-center mt-[30px]">
            <GradientButton
              label="Get Started"
              width={144}
              height={54}
              borderRadius={30}
              onClick={() => {
                router.push(`/${username}/merch/new`)
              }}
            />
          </div>
        </div>
      )}

      <MerchShopUpdateModal
        userId={userId}
        data={selectedCard}
        open={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onRemove={() => {
          setShowUpdateModal(false)
          setTimeout(() => {
            setEditType('remove')
            setShowEditModal(true)
          }, 500)
        }}
        onSuccess={() => onSuccessUpdate()}
      />

      <MerchShopEditModal
        userId={userId}
        data={selectedCard}
        type={editType}
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => onSuccess()}
      />
    </div>
  )
}

export default MerchStoreActivity
