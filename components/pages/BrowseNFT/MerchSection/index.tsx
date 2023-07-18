import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// components
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'

// styles
import styles from './index.module.scss'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

import MerchApparelSection from './MerchApparelSection'
import MerchWallArtSection from './MerchWallArtSection'
import ApparelSection from './MerchApparelSection/ApparelSection'
import WallSection from './MerchWallArtSection/WallSection'

const MerchSection = props => {
  const { data, openNftPage } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const { connected, publicKey, signMessage } = useWallet()
  const { setVisible } = useWalletModal()
  const [openApparelDetail, setOpenApparelDetail] = useState(data?.category === 'apparel')
  const [openWallArtDetail, setOpenWallArtDetail] = useState(data?.category === 'print')

  const [finishEditing, setFinishEditing] = useState(false)
  const [showApparelMode, setShowApparelMode] = useState(data?.category === 'apparel')
  const [showWallArtMode, setShowWallArtMode] = useState(data?.category === 'print')

  const [openProgressingModal, setOpenProgressingModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const [alertData, setAlertData] = useState<any[]>([])

  const gotoUserDetail = link => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/${link}`)
  }

  const [apparel, setApparel] = useState(null)
  const [wallArt, setWallArt] = useState(null)
  const [printImageUrl, setPrintImageUrl] = useState(null)

  return (
    <div className={styles.container}>
      <div className="w-full grid grid-cols-2 gap-10">
        {showApparelMode ? (
          <div className="col-span-2 lg:col-span-1">
            <div className={styles.blurBackground}>
              <div className="absolute inset-0">
                <img src={data?.nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
              </div>
              <div className={styles.blurImage} />

              <ApparelSection
                nftName={data?.nftName}
                apparel={apparel}
                nftCoverUrl={data?.nftCoverUrl}
                finishEditing={finishEditing}
                setPrintImageUrl={setPrintImageUrl}
              />
            </div>
          </div>
        ) : showWallArtMode ? (
          <div className="col-span-2 lg:col-span-1">
            <div className={styles.blurBackground}>
              {!wallArt && (
                <div className="absolute inset-0">
                  <img src={data?.nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
                </div>
              )}

              <WallSection wallArt={wallArt} finishEditing={finishEditing} />
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="col-span-2 lg:col-span-1 z-10">
          {openApparelDetail ? (
            <MerchApparelSection
              nftName={data?.nftName}
              open={openApparelDetail}
              subCategory={data?.subCategory}
              onBack={() => {
                openNftPage()
              }}
              setFinishEditing={editing => setFinishEditing(editing)}
              setApparel={apparel => setApparel(apparel)}
              setShowApparelMode={mode => setShowApparelMode(mode)}
            />
          ) : openWallArtDetail ? (
            <MerchWallArtSection
              nftName={data?.nftName}
              nftImage={data?.nftCoverUrl}
              open={openWallArtDetail}
              subCategory={data?.subCategory}
              onBack={() => {
                openNftPage()
              }}
              setFinishEditing={editing => setFinishEditing(editing)}
              setWallArt={image => setWallArt(image)}
              setShowWallArtMode={mode => setShowWallArtMode(mode)}
            />
          ) : (
            <></>
          )}
        </div>
      </div>

      {openProgressingModal && <ProgressingModal open={openProgressingModal} />}

      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  )
}

export default MerchSection
