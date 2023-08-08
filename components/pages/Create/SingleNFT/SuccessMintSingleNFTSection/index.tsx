import React, { useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// next components
import { useRouter } from 'next/router'

// components
import MintAudioPlayer from 'components/MediaPlayer/MintAudioPlayer'
import OutlineButton from 'components/Button/OutlineButton'
import LinkTextButton from 'components/Button/LinkTextButton'

import TweetMintButton from 'components/Button/TweetMintButton'
import MintOutlineButton from 'components/Button/MintOutlineButton'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

//explorer
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'
import { TwitterShareButton } from 'react-share'

// api
import SellNFTModal from 'components/Modal/SellNFTModal'
import ListNFTModal from 'components/Modal/ListNFTModal'
import StartAuctionModal from 'components/Modal/StartAuctionModal'
import Alert from 'components/Alert'
import ProgressingModal from 'components/Modal/ProgressingModal'

const SuccessMintSingleNFTSection = props => {
  const { nftName, nftType, nftArt, nftImage, artWidth, nftAddress, nftMetadata } = props

  const router = useRouter()
  const dispatch = useDispatch()
  const viewport = useViewport()
  const openSellNFTModal = useSelector<any>(state => state.openSellNFTModal)
  const { connection } = useConnection()
  const explorerURL = useMemo(
    () => getExplorerUrl(connection.rpcEndpoint, nftAddress?.toBase58()),
    [nftAddress, connection]
  )
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

  // useEffect(() => {
  //   if (openProgressingModal) {
  //     setTimeout(() => {
  //       setOpenProgressingModal(false)
  //       setTimeout(() => {
  //         setShowAlert(true)
  //       }, 1000)
  //     }, 3000)
  //   }
  // }, [openProgressingModal])

  return (
    <div>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
          <div className={styles.topLeftEllipse}>
            <svg xmlns="http://www.w3.org/2000/svg" width="2321" height="2321" viewBox="0 0 2321 2321">
              <defs>
                <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                  <stop offset="0" stopColor="var(--ellipse-svg-1)" stopOpacity="0.404" />
                  <stop offset="1" stopColor="var(--ellipse-svg-2)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle
                id="Ellipse_4322"
                data-name="Ellipse 4322"
                cx="1010.5"
                cy="1010.5"
                r="1010.5"
                transform="translate(150 150)"
                fill="url(#radial-gradient)"
              />
            </svg>
          </div>
          <div className="w-full flex flex-wrap justify-center items-center mt-10 lg:mt-20 z-10">
            {nftType === 'image' ? (
              <div className={`${styles.artArea}`} style={{ width: artWidth, height: artWidth }}>
                {nftImage !== '' && artWidth !== 0 ? (
                  <img src={nftImage} alt="" className="w-full h-full object-contain" />
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
                      <img src={nftImage} alt="" className="w-full h-full object-contain z-10" />
                    )}
                  </div>
                ) : nftImage !== '' && artWidth !== 0 ? (
                  <img src={nftImage} alt="" className="w-full h-full rounded-[6px] object-contain" />
                ) : (
                  <div className={`${styles.artArea}`} style={{ width: artWidth, height: artWidth }} />
                )}
              </div>
            )}
          </div>
          <div className="max-w-[800px] mt-6 mb-[130px] flex flex-wrap justify-center z-10">
            <div className={styles.mintTitle}>Congratulations!</div>
            <div className={styles.mintText}>
              Your NFT has been minted successfully and can be viewed on the&nbsp;
              <a className={styles.mintLinkText} href={'/nft/' + nftAddress}>
                NFT page
              </a>
            </div>
            <div className="w-full flex justify-between gap-[30px] mt-[60px]">
              <div className="w-full">
                <TwitterShareButton
                  title="Just dropped a fresh new mint on @foster_protocol #fostermarketplace"
                  url={nftDetailUrl}
                  beforeOnClick={() => {}}
                  onShareWindowClose={() => {}}
                  className="w-full"
                >
                  <TweetMintButton
                    fullWidth
                    label="Tweet your Mint"
                    color={'var(--mint-btn-color)'}
                    onClick={() => {}}
                    direction="rtl"
                  />
                </TwitterShareButton>
              </div>
              <div className="w-full">
                <MintOutlineButton
                  fullWidth
                  label="List or Start Auction"
                  backgroundColor="#63D6CD"
                  onClick={() => dispatch({ type: 'set', openSellNFTModal: true })}
                  borderColor={'var(--outline-button-border)'}
                />
              </div>
            </div>
            <div className="mt-[44px]">
              <LinkTextButton label="View on SolanaFM" link={explorerURL} />
            </div>
          </div>
        </div>
      ) : (
        <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
          <div className="w-full flex justify-center items-center z-10 mt-10">
            <div className="z-10">
              <div className="w-full">
                {nftType === 'image' ? (
                  <div className={`${styles.artArea}`} style={{ width: artWidth, height: artWidth }}>
                    {nftImage !== '' && artWidth !== 0 && artWidth !== 0 ? (
                      <img src={nftImage} alt="" className="w-full h-full object-contain" />
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
                          <img src={nftImage} alt="" className="w-full h-full object-contain z-10" />
                        )}
                      </div>
                    ) : nftImage !== '' && artWidth !== 0 && artWidth !== 0 ? (
                      <img src={nftImage} alt="" className="w-full h-full object-contain" />
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
            <div className={styles.mintText}>Your NFT has been minted successfully!</div>
            <div className="w-full flex flex-wrap justify-center gap-[30px] mt-[60px]">
              <div className="w-[221px]">
                <TwitterShareButton
                  title="Just dropped a fresh new mint on @foster_protocol #fostermarketplace"
                  url={nftDetailUrl}
                  beforeOnClick={() => {}}
                  onShareWindowClose={() => {}}
                  className="w-full"
                >
                  <TweetMintButton
                    fullWidth
                    label="Tweet your Mint"
                    backgroundColor01="#95DBD5"
                    backgroundColor02="#4B6E6B"
                    color="#202427"
                    onClick={() => {}}
                    direction="rtl"
                  />
                </TwitterShareButton>
              </div>
              <div className="w-[221px]">
                <OutlineButton
                  fullWidth
                  label="List or Start Auction"
                  height="45px"
                  onClick={() => dispatch({ type: 'set', openSellNFTModal: true })}
                  borderColor={'var(--back-btn-border-mobile)'}
                />
              </div>
            </div>
            <div className="mt-[33px]">
              <LinkTextButton label="View on SolanaFM" link={explorerURL} />
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
          mintAddress: nftAddress,
          name: nftName,
          json: nftMetadata,
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
          json: nftMetadata,
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
            dispatch({ type: 'set', isLoading: true })
            router.push('/')
          }, 500)
        }}
        data={alertData}
      />
    </div>
  )
}

export default SuccessMintSingleNFTSection
