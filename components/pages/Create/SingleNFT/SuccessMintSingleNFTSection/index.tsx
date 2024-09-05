import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// next components
import { useRouter } from 'next/router'

// components
import Lottie from 'lottie-react'
import MintAudioPlayer from 'components/MediaPlayer/MintAudioPlayer'
import OutlineButton from 'components/Button/OutlineButton'

// resources
import MintSuccessIcon from 'assets/lottery/mint-success.json'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

//explorer
import { TwitterShareButton } from 'react-share'

// api
import SellNFTModal from 'components/Modal/SellNFTModal'
import ListNFTModal from 'components/Modal/ListNFTModal'
import StartAuctionModal from 'components/Modal/StartAuctionModal'
import Alert from 'components/Alert'
import ProgressingModal from 'components/Modal/ProgressingModal'
import ImageWithFoster from 'components/ImageWithFoster'
import GradientButton from 'components/Button/GradientButton'

const SuccessMintSingleNFTSection = props => {
  const { nftName, nftType, nftArt, nftImage, artWidth, nftAddress } = props

  const router = useRouter()
  const dispatch = useDispatch()
  const viewport = useViewport()
  const openSellNFTModal = useSelector<any>(state => state.openSellNFTModal)
  const nftDetailUrl = globalThis.window?.origin + '/nft/' + nftAddress

  const [showListNFTModal, setShowListNFTModal] = useState(false)
  const [showStartAuctionModal, setShowStartAuctionModal] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [openProgressingModal, setOpenProgressingModal] = useState(false)
  const [showAlert, setShowAlert] = useState<boolean>(false)

  const handleCloseSellNFTModal = () => {
    dispatch({ type: 'set', openSellNFTModal: false })
  }

  const handleStartProgress = () => {
    setOpenProgressingModal(true)
  }

  const handleSuccessAuction = nftName => {
    setOpenProgressingModal(false)

    setAlertData([
      {
        id: 0,
        title: 'Auction Published!',
        description: `You've successfully published an auction for ${nftName}`,
        type: 'success',
      },
    ])

    setTimeout(() => {
      setShowStartAuctionModal(false)
      setTimeout(() => {
        setShowAlert(true)
      }, 1000)
    }, 1000)
  }

  return (
    <div>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
          <div className="w-full flex flex-wrap justify-center items-center mt-10 lg:mt-20 z-10">
            {nftType === 'image' ? (
              <div className={`${styles.artArea}`} style={{ width: 550, height: 550 }}>
                {nftImage !== '' && artWidth !== 0 ? (
                  <ImageWithFoster src={nftImage} className="w-full h-full object-contain" />
                ) : (
                  <div className={`${styles.artArea}`} style={{ width: 550, height: 550 }} />
                )}
              </div>
            ) : (
              <div className={`${styles.artArea}`} style={{ width: 550, height: 550 }}>
                {nftType === 'video' ? (
                  <video controls className="w-full">
                    <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                    Your browser does not support the video tag.
                  </video>
                ) : nftType === 'audio' ? (
                  <div className="z-10">
                    <MintAudioPlayer src={URL.createObjectURL(nftArt[0])} />
                    {nftImage !== '' && artWidth !== 0 && (
                      <ImageWithFoster src={nftImage} className="w-full h-full object-contain z-10" />
                    )}
                  </div>
                ) : nftImage !== '' && artWidth !== 0 ? (
                  <ImageWithFoster src={nftImage} className="w-full h-full rounded-[6px] object-contain" />
                ) : (
                  <div className={`${styles.artArea}`} style={{ width: 550, height: 550 }} />
                )}
              </div>
            )}
          </div>
          <div className="max-w-[800px] mt-[47px] mb-[130px] flex flex-wrap justify-center z-10">
            <div className={styles.mintTitle}>Congratulations!</div>
            <div className={styles.mintText}>{nftName} has been minted successfully</div>
            <div className="w-full flex justify-center gap-[30px] mt-[47px]">
              <div className="flex gap-[30px]">
                <div className="w-full">
                  <TwitterShareButton
                    title="Just dropped a fresh new mint on @foster_protocol #fostermarketplace"
                    url={nftDetailUrl}
                    beforeOnClick={() => {}}
                    onShareWindowClose={() => {}}
                    className="w-full"
                  >
                    <GradientButton width={300} label="Tweet your Mint" onClick={() => {}} />
                  </TwitterShareButton>
                </div>
                <div className="w-full">
                  <OutlineButton width={300} label="List Artwork" onClick={() => router.push('/nft/' + nftAddress)} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0">
            <Lottie animationData={MintSuccessIcon} loop={false} />
          </div>
        </div>
      ) : (
        <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
          <div className="w-full flex justify-center items-center z-10">
            <div className="z-10">
              <div className="w-full">
                {nftType === 'image' ? (
                  <div className={`${styles.artArea}`} style={{ width: artWidth, height: artWidth }}>
                    {nftImage !== '' && artWidth !== 0 && artWidth !== 0 ? (
                      <ImageWithFoster src={nftImage} className="w-full h-full object-contain" />
                    ) : (
                      <div className={`${styles.artArea}`} style={{ width: artWidth, height: artWidth }} />
                    )}
                  </div>
                ) : (
                  <div className={`${styles.artArea}`} style={{ width: artWidth, height: artWidth }}>
                    {nftType === 'video' ? (
                      <video controls className="w-full">
                        <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                        Your browser does not support the video tag.
                      </video>
                    ) : nftType === 'audio' ? (
                      <div className="z-10">
                        <MintAudioPlayer src={URL.createObjectURL(nftArt[0])} />
                        {nftImage !== '' && artWidth !== 0 && (
                          <ImageWithFoster src={nftImage} className="w-full h-full object-contain z-10" />
                        )}
                      </div>
                    ) : nftImage !== '' && artWidth !== 0 && artWidth !== 0 ? (
                      <ImageWithFoster src={nftImage} className="w-full h-full object-contain" />
                    ) : (
                      <div className={`${styles.artArea}`} style={{ width: artWidth, height: artWidth }} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full mt-6 mb-[90px] flex flex-wrap justify-center z-10">
            <div className={styles.mintTitle}>Congratulations!</div>
            <div className={styles.mintText}>{nftName} has been minted successfully</div>
            <div className="w-full flex flex-wrap justify-center gap-[12px] mt-[30px]">
              <div className="w-full">
                <TwitterShareButton
                  title="Just dropped a fresh new mint on @foster_protocol #fostermarketplace"
                  url={nftDetailUrl}
                  beforeOnClick={() => {}}
                  onShareWindowClose={() => {}}
                  className="w-full"
                >
                  <GradientButton fullWidth label="Tweet your Mint" onClick={() => {}} />
                </TwitterShareButton>
              </div>
              <div className="w-full">
                <OutlineButton fullWidth label="List Artwork" onClick={() => router.push('/nft/' + nftAddress)} />
              </div>
            </div>
          </div>
        </div>
      )}
      <SellNFTModal
        open={openSellNFTModal}
        close={() => handleCloseSellNFTModal()}
        onList={() => setTimeout(() => setShowListNFTModal(true), 500)}
        onAuction={() => setTimeout(() => setShowStartAuctionModal(true), 500)}
      />
      <ListNFTModal
        data={{
          mintAddress: nftAddress.toBase58(),
          name: nftName,
          image: nftImage,
        }}
        open={showListNFTModal}
        onClose={(status: string) => {
          setShowListNFTModal(false)
          setTimeout(() => {
            if (status === 'list-close') {
              router.push('/')
            } else if (status === 'listed') {
              router.push(`/dashboard?tab=1&filter=0`)
            }
          }, 1000)
        }}
      />
      <StartAuctionModal
        data={{
          mintAddress: nftAddress,
          name: nftName,
          category: nftType,
          image: nftImage,
        }}
        open={showStartAuctionModal}
        onSuccess={nft => handleSuccessAuction(nft)}
        onStartProgress={() => handleStartProgress()}
        onClose={() => setShowStartAuctionModal(false)}
      />

      <ProgressingModal open={openProgressingModal} />

      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
          setTimeout(() => {
            router.push('/')
          }, 500)
        }}
        data={alertData}
      />
    </div>
  )
}

export default SuccessMintSingleNFTSection
