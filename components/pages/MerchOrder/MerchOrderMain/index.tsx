import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// next component

//components
import MerchShopClipboardChip from 'components/Chip/MerchShopClipboardChip'

// images
import ShareDesktopIcon from 'assets/icons/share-icon-707070.svg?component'
import ShareSmallIcon from 'assets/icons/share-black-menu.svg?component'
import InfoIcon from 'assets/icons/info-green-small.svg?component'
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-13x11.svg?component'
import ArrowLeftIcon from 'assets/icons/arrow-left-24x24.svg?component'

// json
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import PrimaryButton from 'components/Button/PrimaryButton'
import SocialShareModal from 'components/Menu/SocialShareModal'
import SizeChartModal from 'components/Modal/SizeChartModal'

const MerchOrderMain = props => {
  const { type, username, onClickBuyNow } = props
  const router = useRouter()
  const [openShareModal, setOpenShareModal] = useState(false)
  const [share, setShare] = useState<boolean>(false)
  const [shareCount, setShareCount] = useState(0)
  const alertEmb = 'alert-emb'
  const alertEmbMobile = 'alert-emb-mobile'
  const alertNote = 'alert-note'
  const alertNoteMobile = 'alert-mobile'
  const [tableModal, setTableModal] = useState(false)
  const [sizeList, setSizeList] = useState([
    { id: 0, name: 'XS', selected: false },
    { id: 1, name: 'S', selected: false },
    { id: 2, name: 'M', selected: false },
    { id: 3, name: 'L', selected: false },
    { id: 4, name: 'XL', selected: true },
    { id: 5, name: '2XL', selected: false },
    { id: 6, name: '3XL', selected: false },
    { id: 7, name: '4XL', selected: false },
    { id: 8, name: '5XL', selected: false },
  ])
  const [descCount, setDescCount] = useState(280)
  const description =
    'Untitled Abstract #17 Physical Acrylic Brick Painting on 10x8 inch Canvas. Untitled Abstract #17 Physical Acrylic Brick Painting on 10x8 inch Canvas.Untitled Abstract #17 Physical Acrylic Brick Painting on 10x8 inch Canvas. Untitled Abstract #17 Physical Acrylic Brick Painting on 10x8 inch Canvas. Untitled Abstract #17 Physical Acrylic Brick Painting on 10x8 inch Canvas.Untitled Abstract #17 Physical Acrylic Brick Painting on 10x8 inch Canvas. Untitled Abstract #17 Physical Acrylic Brick Painting on 10x8 inch Canvas. Untitled Abstract #17 Physical Acrylic Brick Painting on 10x8 inch Canvas.Untitled Abstract #17 Physical Acrylic Brick Painting on 10x8 inch Canvas.'
  const [isTruncated, setIsTruncated] = useState(true)
  const [tempNftDescription, setTempNftDescription] = useState('')
  const processedNftDescription = isTruncated ? tempNftDescription.slice(0, descCount) : tempNftDescription
  const shouldShowReadMore = tempNftDescription.length > descCount

  const [mintQty, setMintQty] = useState(0)
  const [nftPrice, setNftPrice] = useState(1.4)
  const [buyNowLoading, setBuyNowLoading] = useState(false)

  useEffect(() => {
    function handleResize() {
      let screenWidth = window.innerWidth
      let count = screenWidth >= 1536 ? 240 : screenWidth >= 1280 ? 220 : screenWidth >= 1024 ? 200 : 200
      setDescCount(count)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setTempNftDescription(description)
  }, [description])

  function toggleIsTruncated() {
    setIsTruncated(!isTruncated)
  }

  useEffect(() => {
    document.getElementById(alertEmb).style.display = 'none'
    document.getElementById(alertEmbMobile).style.display = 'none'
    document.getElementById(alertNote).style.display = 'none'
    document.getElementById(alertNoteMobile).style.display = 'none'
  }, [])

  const onClickSize = index => {
    let newSize = []
    sizeList.map(item => {
      if (item.id === index) {
        newSize.push({ ...item, selected: true })
      } else {
        newSize.push({ ...item, selected: false })
      }
    })
    setSizeList(newSize)
  }

  const getApparelName = () => {
    let type = 'Unisex'
    let name = 'Hoodie'
    let list = ShopApparelList.filter(item => item.base === name && item.sub_type == type)
    if (list.length > 0) return list[0].name
    else return name
  }

  const getApparelLabel = () => {
    let type = 'Unisex'
    let name = 'Hoodie'
    let list = ShopApparelList.filter(item => item.base === name && item.sub_type == type)
    if (list.length > 0) return list[0].label
    else return name
  }

  return (
    <div className={styles.container}>
      <div className="lg:hidden flex mt-[20px]">
        <div className={styles.backStore} onClick={() => router.push(`/${username}/merch`)}>
          <ArrowLeftIcon />
          Back to store
        </div>
      </div>
      <div className="w-full min-h-[680px] lg:px-[30px] pt-[20px] pb-[0px] flex flex-col justify-between">
        <div className="w-full">
          <div className="w-full flex justify-between">
            <div className={styles.productName}>product_name</div>

            <div className={styles.shareIcon} onClick={() => setOpenShareModal(true)}>
              <div className="lg:block hidden">
                <ShareDesktopIcon alt="" />
              </div>
              <div className="lg:hidden block">
                <ShareSmallIcon alt="" />
              </div>
              <div className={`${styles.shareText} mt-[-2px] lg:block hidden`}>Share</div>
            </div>
          </div>

          <div className="mt-[20px]">
            <div className={styles.creator}>Creator</div>
            <div className="mt-[7px] flex flex-wrap gap-[15px]">
              <div className={styles.creatorRound}>
                <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                  <ImageWithFoster
                    src={
                      'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM'
                    }
                    alt=""
                  />
                </div>
                creator_name
              </div>
              <div className={styles.creatorRound}>Limited Supply</div>
              <div className={styles.creatorRound}>23/50 left</div>
            </div>
          </div>

          <div className={`mt-[20px] ${styles.divider}`} />

          {type === 'foster' && (
            <div className="mt-[15px]">
              <div className={styles.desc}>Details</div>
              <div className="w-full flex justify-between mt-[7px]">
                <div className={styles.content}>Apparel Type</div>
                <div className={styles.contentValue}>Premimum Hoodie</div>
              </div>
              <div className="w-full flex justify-between mt-[6px]">
                <div className={styles.content}>Print Technique</div>
                <div className={styles.contentValue}>Embroidery</div>
              </div>
              <div className="w-full flex justify-between mt-[6px]">
                <div className={styles.content}>Print Areas</div>
                <div className={styles.contentValue}>Center Chest, Left Wrist</div>
              </div>
              <div className="w-full flex justify-between mt-[6px]">
                <div className={styles.content}>Color</div>
                <div className={styles.contentValue}>Black</div>
              </div>
            </div>
          )}

          {type === 'user' && (
            <div className="mt-[15px]">
              <div className={styles.desc}>Description</div>

              <div className={`mt-[10px] ${styles.content}`}>
                {processedNftDescription}
                {shouldShowReadMore && (
                  <span onClick={toggleIsTruncated} className={`${styles.greenText} min-w-max cursor-pointer`}>
                    {isTruncated ? '... Expand' : ' Collapse'}
                  </span>
                )}
              </div>
            </div>
          )}

          {type === 'foster' && <div className={`mt-[15px] ${styles.divider}`} />}

          {type === 'foster' && (
            <div className="mt-[20px]">
              <div className="w-full flex justify-between items-center">
                <div className={styles.desc}>Select Size</div>
                <div className={styles.sizeChart} onClick={() => setTableModal(true)}>
                  Size Chart »
                </div>
              </div>
              <div className="mt-[15px]">
                <div className="w-full flex flex-wrap gap-[9px]">
                  {sizeList.map((item, index) => (
                    <div
                      key={index}
                      className={item.selected ? styles.selectedSize : styles.unselectedSize}
                      onClick={() => onClickSize(index)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {type === 'foster' && <div className={`mt-[20px] ${styles.divider}`} />}
        </div>

        <div className="w-full">
          <div className="mt-[20px]">
            <div className="flex flex-wrap items-end gap-[6px]">
              <div className={styles.endsIn}>Ends in</div>
              <div className={styles.endsTime}>02d 05h 10m 30s</div>
            </div>
            <div className="w-full mt-[10px]">
              <div className={styles.mintQty}>
                <div
                  onClick={() => {
                    if (mintQty > 0) {
                      setMintQty(mintQty - 1)
                      let price = (
                        nftPrice * (mintQty - 1) * 1.05 +
                        0.01 * (mintQty - 1) +
                        0.013 * (mintQty - 1) +
                        0.0003
                      ).toFixed(2)
                    }
                  }}
                >
                  <div className={styles.minus}>-</div>
                </div>
                <div className={styles.mintLabel}>
                  Qty&nbsp;<div className={styles.mintValue}>{mintQty}</div>
                </div>
                <div
                  onClick={() => {
                    let price = (
                      nftPrice * (mintQty + 1) * 1.05 +
                      0.01 * (mintQty + 1) +
                      0.013 * (mintQty + 1) +
                      0.0003
                    ).toFixed(2)
                    setMintQty(mintQty + 1)
                  }}
                >
                  <div className={styles.minus}>+</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-[20px] ${styles.divider}`} />

          <div className="w-full flex justify-between mt-[20px] relative">
            <div>
              <div className="flex gap-[7px] items-center relative">
                <div className={styles.infoText}>
                  {type === 'foster' ? 'Embroidery Disclaimer' : 'Shipping & Handling'}
                </div>
                <div
                  onMouseEnter={() => {
                    document.getElementById(alertEmb).style.display = 'block'
                  }}
                  onMouseLeave={() => {
                    document.getElementById(alertEmb).style.display = 'none'
                  }}
                  onClick={() => {
                    document.getElementById(alertEmbMobile).style.display = 'block'
                    setTimeout(() => {
                      document.getElementById(alertEmbMobile).style.display = 'none'
                    }, 3000)
                  }}
                >
                  <InfoIcon />
                </div>
                <div className="lg:block hidden">
                  <MerchShopClipboardChip
                    width={type === 'foster' ? null : '500px'}
                    title={type === 'foster' ? 'Embroidery Disclaimer' : 'Shipping & Handling'}
                    text={
                      type === 'foster'
                        ? 'Please note that the actual embroidered design may vary from the digital preview shown. While we strive for accuracy, the nature of embroidery can result in differences in color, texture, and placement.'
                        : 'Domestic & international shipping will be paid by the buyer.'
                    }
                    identifier={alertEmb}
                  />
                </div>
              </div>

              <div className="flex gap-[7px] items-center mt-[10px] relative">
                <div className={styles.infoText}>{type === 'foster' ? 'Customs Notice' : 'Liability Disclaimer'}</div>
                <div
                  onMouseEnter={() => {
                    document.getElementById(alertNote).style.display = 'block'
                  }}
                  onMouseLeave={() => {
                    document.getElementById(alertNote).style.display = 'none'
                  }}
                  onClick={() => {
                    document.getElementById(alertNoteMobile).style.display = 'block'
                    setTimeout(() => {
                      document.getElementById(alertNoteMobile).style.display = 'none'
                    }, 3000)
                  }}
                >
                  <InfoIcon />
                </div>
                <div className="lg:block hidden">
                  <MerchShopClipboardChip
                    title={type === 'foster' ? 'Customs Notice' : 'Liability Disclaimer'}
                    text={
                      type === 'foster'
                        ? 'All customers outside of the United States are responsible for the customs fees/duties that may be charged by their country for import. This amount may vary depending on your country. We advise looking up your country’s policies before purchasing so you are aware of any potential fees.'
                        : 'Users are solely responsible for conducting their own due diligence before engaging in any transaction. All transactions are conducted at your own risk. Any disputes arising from transactions conducted on the platform are to be resolved directly between the buyer and seller.'
                    }
                    identifier={alertNote}
                  />
                </div>
              </div>

              <div className="lg:hidden block w-full">
                <MerchShopClipboardChip
                  type="Embroidery"
                  title={type === 'foster' ? 'Embroidery Disclaimer' : 'Shipping & Handling'}
                  text={
                    type === 'foster'
                      ? 'Please note that the actual embroidered design may vary from the digital preview shown. While we strive for accuracy, the nature of embroidery can result in differences in color, texture, and placement.'
                      : 'Domestic & international shipping will be paid by the buyer.'
                  }
                  identifier={alertEmbMobile}
                />
              </div>
              <div className="lg:hidden block w-full">
                <MerchShopClipboardChip
                  type="custom"
                  title={type === 'foster' ? 'Customs Notice' : 'Liability Disclaimer'}
                  text={
                    type === 'foster'
                      ? 'All customers outside of the United States are responsible for the customs fees/duties that may be charged by their country for import. This amount may vary depending on your country. We advise looking up your country’s policies before purchasing so you are aware of any potential fees.'
                      : 'Users are solely responsible for conducting their own due diligence before engaging in any transaction. All transactions are conducted at your own risk. Any disputes arising from transactions conducted on the platform are to be resolved directly between the buyer and seller.'
                  }
                  identifier={alertNoteMobile}
                />
              </div>
            </div>

            <div>
              <div className="flex gap-[6px] items-center mb-[2px]">
                <SolanaLogoIcon className="mt-[4px]" />
                <div className={styles.price}>0.65</div>
              </div>
              <div className={styles.priceUS}>$642.00</div>
            </div>
          </div>

          <div className="w-full mt-[20px]">
            {buyNowLoading ? (
              <LoadingPrimaryButton fullWidth />
            ) : (
              <PrimaryButton fullWidth type="buy-now" label="Buy Now" onClick={() => onClickBuyNow()} />
            )}
          </div>
        </div>
      </div>

      {openShareModal && (
        <SocialShareModal
          open={openShareModal}
          close={() => setOpenShareModal(false)}
          vote={share}
          setVote={setShare}
          voteCount={shareCount}
          setVoteCount={setShareCount}
          message={'Check out this fresh art on @foster_protocol #fostermarketplace'}
          url={`/${username}/merch/${123}`}
        />
      )}

      <SizeChartModal
        open={tableModal}
        title={getApparelName()}
        label={getApparelLabel()}
        onClose={() => setTableModal(false)}
      />
    </div>
  )
}

export default MerchOrderMain
