import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useViewport } from 'utils'

// next component

// components
import MerchOrderMain from 'components/pages/MerchOrder/MerchOrderMain'
import ArrowLeftIcon from 'assets/icons/arrow-left-24x24.svg?component'
import LeftBtnIcon from 'assets/icons/arrow-left-17x13.svg?component'
import RightBtnIcon from 'assets/icons/arrow-right-17x13.svg?component'

// json

// styles
import styles from './index.module.scss'
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import ImageWithFoster from 'components/ImageWithFoster'
import MerchOrderShipping from 'components/pages/MerchOrder/MerchOrderShipping'
import { useDispatch } from 'react-redux'
import MerchOrderShippingMethod from 'components/pages/MerchOrder/ShippingMethod'

interface MerchOrderPageProps {
  publicArtistData?: any
  productData?: any
  error?: string
}

const MerchOrderPage = ({ publicArtistData, productData }: MerchOrderPageProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const viewport = useViewport()
  const [productDetail, setProductDetail] = useState(null)
  const [shipppingMethod, setShippingMethod] = useState(null)
  const [shippingData, setShippingData] = useState(null)
  const [shippingLocal, setShippingLocal] = useState(true)
  const [printData, setPrintData] = useState(null)
  const [totalCost, setTotalCost] = useState(null)
  const [merchQuantity, setMerchQuantity] = useState(1)
  const [merchSize, setMerchSize] = useState('L')
  const [merchList, setMerchList] = useState([])
  const [rawUrlList, setRawUrlList] = useState([])
  const [selectedMerch, setSelectedMerch] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [type, setType] = useState('')

  const onClickMerch = key => {
    let list = []
    merchList.map((merch, index) => {
      if (key === index) {
        list.push({ id: index, url: merch.url, selected: true })
        setSelectedMerch({ id: index, url: merch.url, selected: true })
      } else {
        list.push({ id: index, url: merch.url, selected: false })
      }
    })
    setMerchList(list)
  }

  const onClickBuyNow = () => {
    setCurrentStep(2)
  }

  useEffect(() => {
    if (!productData || !publicArtistData) return

    setProductDetail(productData)
    let imageList = [],
      rawList = []
    if (productData.fulfillment_type === 'foster') {
      productData.options.addons.map((item, index) => {
        imageList.push({ id: index, url: item.mockup_url, selected: index === 0 })
        rawList.push({ url: item.raw_url })
      })
      setType('foster')
    } else {
      productData.options.product_images.map((item, index) => {
        imageList.push({ id: index, url: item, selected: index === 0 })
      })
      if (productData.master_edition_address === null) setType('physical')
      else setType('')
    }
    setMerchList(imageList)
    setRawUrlList(rawList)
    setSelectedMerch(imageList[0])

    setPrintData({
      id: 1,
      quantity: merchQuantity,
      size: merchSize,
      color: productData.options.color,
      name: productData.name,
      description: productData.description,
      technique: productData.options.print_technique,
      cost: productData.selling_price / 100,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData])

  return (
    <div className="w-full block lg:flex">
      <div
        className={`w-full lg:max-w-[58%] lg:min-w-[58%] ${
          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'g-container' : 'g-left-container'
        }`}
      >
        <div className="w-full flex">
          <div className="hidden lg:block mt-[75px] min-w-[130px]">
            <div className="lg:block hidden">
              <div className={styles.backStore} onClick={() => router.push(`/${router.query.id}/merch`)}>
                <ArrowLeftIcon />
                Back to store
              </div>
            </div>

            {productDetail ? (
              <div className="lg:flex hidden w-[75px] h-[75px] flex flex-col gap-[11px] mt-[30px]">
                {merchList.length > 1 &&
                  merchList.map((merch, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => onClickMerch(index)}
                        className={merch.selected ? styles.image : styles.imageHover}
                      >
                        <div className={merch.selected ? styles.selected : styles.unselected}>
                          <ImageWithFoster
                            width={350}
                            height={350}
                            src={merch.url}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="mt-[30px] lg:block hidden">
                <div className="w-[75px] h-[75px] rounded-[10px] overflow-hidden">
                  <div className="skeletonLoader" />
                </div>
                <div className="w-[75px] h-[75px] rounded-[10px] overflow-hidden mt-[11px]">
                  <div className="skeletonLoader" />
                </div>
                <div className="w-[75px] h-[75px] rounded-[10px] overflow-hidden mt-[11px]">
                  <div className="skeletonLoader" />
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-full flex justify-center max-w-[400px] lg:max-w-[625px]">
              <div className={`lg:hidden block h-auto w-full mb-[20px] mt-[${type === 'foster' ? 20 : 0}px]`}>
                <div className={styles.mobileImageArea}>
                  <div className={styles.imageArea}>
                    <div
                      className={styles.imageContent}
                      style={{
                        background: type === 'physical' ? 'rgba(var(--main-bg-color-rgb), 0.05)' : 'transparent',
                      }}
                    >
                      <ImageWithFoster
                        width={700}
                        src={selectedMerch ? selectedMerch.url : ''}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`lg:block hidden sm:w-[640px] sm:h-[auto] lg:w-[400px] xl:w-[500px] 2xl:w-[625px] lg:h-[705px] mt-[20px] lg:mt-[75px]`}
              >
                <div className={styles.imageArea}>
                  <div
                    className={styles.imageContent}
                    style={{
                      background: type === 'physical' ? 'rgba(var(--main-bg-color-rgb), 0.05)' : 'transparent',
                      borderRadius: '15px',
                      overflow: 'hidden',
                    }}
                  >
                    <ImageWithFoster
                      width={700}
                      src={selectedMerch ? selectedMerch.url : ''}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                {merchList.length > 1 && selectedMerch && (
                  <div className="w-full mt-[30px] flex justify-center">
                    <div className="flex gap-[50px]">
                      <div
                        className={selectedMerch.id === 0 ? styles.arrowBtnDisabled : styles.arrowButton}
                        onClick={() => selectedMerch.id > 0 && onClickMerch(selectedMerch.id - 1)}
                      >
                        <LeftBtnIcon />
                      </div>
                      <div
                        className={
                          selectedMerch.id === merchList.length - 1 ? styles.arrowBtnDisabled : styles.arrowButton
                        }
                        onClick={() => selectedMerch.id < merchList.length - 1 && onClickMerch(selectedMerch.id + 1)}
                      >
                        <RightBtnIcon />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`w-full lg:max-w-[42%] lg:max-w-[42%] ${
          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'g-container' : 'g-right-container'
        } lg:flex lg:justify-end ${styles.rightBG}`}
      >
        {merchList.length > 1 && (
          <div className={styles.imageSlider}>
            {productDetail === null ? (
              <div className="w-full flex gap-[15px]">
                <div className="w-[81px] h-[81px] rounded-[10px] overflow-hidden">
                  <div className="skeletonLoader"></div>
                </div>
                <div className="w-[81px] h-[81px] rounded-[10px] overflow-hidden">
                  <div className="skeletonLoader"></div>
                </div>
                <div className="w-[81px] h-[81px] rounded-[10px] overflow-hidden">
                  <div className="skeletonLoader"></div>
                </div>
              </div>
            ) : (
              merchList.map((merch, index) => {
                return (
                  <div key={index} className={styles.image} onClick={() => onClickMerch(index)}>
                    <div className={merch.selected ? styles.selected : styles.unselected}>
                      <ImageWithFoster width={350} src={merch.url} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        <div className="lg:max-w-[545px] w-full mb-[50px] mt-[20px] lg:mt-[0px] lg:ml-[30px]">
          {currentStep === 1 &&
            (productDetail ? (
              <div className="w-full mt-[0px] lg:mt-[75px]">
                <MerchOrderMain
                  username={router.query.id}
                  type={type}
                  productDetail={productDetail}
                  userDetail={publicArtistData}
                  onClickBuyNow={onClickBuyNow}
                  setQuantity={quantity => {
                    let newData = { ...printData }
                    newData.quantity = quantity
                    newData.cost = (productDetail?.selling_price / 100) * quantity
                    setPrintData(newData)
                  }}
                  setMerchSize={size => {
                    setPrintData({ ...printData, size: size })
                  }}
                />
              </div>
            ) : (
              <div>
                <div className="lg:block hidden mt-[75px]">
                  <div className={styles.skeltonContainer}>
                    <div className="w-full h-[700px] flex flex-col justify-between">
                      <div className="w-full">
                        <div className="w-full flex justify-between">
                          <div className="w-[200px] h-[35px] rounded-full overflow-hidden">
                            <div className="skeletonLoader" />
                          </div>
                          <div className="w-[65px] h-[35px] rounded-full overflow-hidden">
                            <div className="skeletonLoader" />
                          </div>
                        </div>

                        <div className="mt-[35px] flex gap-[20px]">
                          <div className="w-[150px] h-[35px] rounded-full overflow-hidden">
                            <div className="skeletonLoader" />
                          </div>
                          <div className="w-[110px] h-[35px] rounded-full overflow-hidden">
                            <div className="skeletonLoader" />
                          </div>
                          <div className="w-[70px] h-[35px] rounded-full overflow-hidden">
                            <div className="skeletonLoader" />
                          </div>
                        </div>

                        <div className="w-full h-[70px] rounded-[10px] overflow-hidden mt-[58px]">
                          <div className="skeletonLoader" />
                        </div>

                        <div className="w-[250px] h-[30px] rounded-[10px] overflow-hidden mt-[58px]">
                          <div className="skeletonLoader" />
                        </div>

                        <div className="w-full h-[45px] rounded-[10px] overflow-hidden mt-[10px]">
                          <div className="skeletonLoader" />
                        </div>

                        <div className="w-full h-[45px] rounded-[10px] overflow-hidden mt-[10px]">
                          <div className="skeletonLoader" />
                        </div>

                        <div className="w-full flex justify-between mt-[58px]">
                          <div className="w-[150px] h-[30px] rounded-[10px] overflow-hidden">
                            <div className="skeletonLoader" />
                          </div>
                        </div>
                        <div className="w-full flex justify-between mt-[20px]">
                          <div className="w-[200px] h-[30px] rounded-[10px] overflow-hidden">
                            <div className="skeletonLoader" />
                          </div>
                        </div>
                        <div className="w-full flex justify-between mt-[20px]">
                          <div className="w-[150px] h-[30px] rounded-[10px] overflow-hidden">
                            <div className="skeletonLoader" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-[20px] lg:hidden block">
                  <div className="w-full flex justify-between">
                    <div className="w-[200px] h-[35px] rounded-[10px] overflow-hidden">
                      <div className="skeletonLoader" />
                    </div>
                    <div className="w-[80px] h-[35px] rounded-[10px] overflow-hidden">
                      <div className="skeletonLoader" />
                    </div>
                  </div>
                  <div className="flex gap-[15px] mt-[20px]">
                    <div className="w-[140px] h-[40px] rounded-full overflow-hidden ">
                      <div className="skeletonLoader" />
                    </div>
                    <div className="w-[140px] h-[40px] rounded-full overflow-hidden ">
                      <div className="skeletonLoader" />
                    </div>
                  </div>
                  <div className="w-full h-[150px] mt-[20px] rounded-[10px] overflow-hidden">
                    <div className="skeletonLoader" />
                  </div>
                </div>
              </div>
            ))}
          {currentStep === 2 && (
            <div className="w-full mt-[0px] lg:mt-[57px]">
              <MerchOrderShipping
                productId={router.query.product_id}
                type={type}
                onBack={info => {
                  setShippingData(info)
                  setCurrentStep(1)
                }}
                onNext={info => {
                  setShippingData(info.data)
                  setShippingLocal(info.local)
                  setShippingMethod(info.method)
                  setCurrentStep(3)
                }}
                onNextOrder={orderId => {
                  let data = {
                    type: 'store',
                    printData,
                    shippingData,
                    username: router.query.id,
                    nftName: printData.name,
                    nftCoverUrl: merchList[0].url,
                    totalCost,
                  }
                  dispatch({ type: 'set', merchData: data })
                  router.push(`/orders/${orderId}`)
                }}
                data={printData}
                merchList={merchList}
                rawList={rawUrlList}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div className="w-full mt-[0px] lg:mt-[57px]">
              <MerchOrderShippingMethod
                productId={router.query.product_id}
                type={type}
                data={printData}
                shippingLocal={shippingLocal}
                shippingData={shippingData}
                allShippingMethod={shipppingMethod}
                setTotalCost={setTotalCost}
                merchList={merchList}
                rawList={rawUrlList}
                mintAddress=""
                onNext={orderId => {
                  let data = {
                    type: 'store',
                    printData,
                    shippingData,
                    username: router.query.id,
                    nftName: printData.name,
                    nftCoverUrl: merchList[0].url,
                    totalCost,
                  }
                  dispatch({ type: 'set', merchData: data })
                  router.push(`/orders/${orderId}`)
                }}
                onBack={() => {
                  setCurrentStep(2)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MerchOrderPage

MerchOrderPage.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}

MerchOrderPage.getInitialProps = async function ({ res, query }): Promise<MerchOrderPageProps> {
  let artistUsername = encodeURIComponent(query.id)
  let productId = encodeURIComponent(query.product_id)
  try {
    let publicArtistData = await fetch(`${process.env.BACKEND_URL}v1/users/username/${artistUsername}`).then(r =>
      r.json()
    )
    let productData = await fetch(`${process.env.BACKEND_URL}v1/stores/${publicArtistData.id}/items/${productId}`).then(
      r => r.json()
    )
    return {
      publicArtistData,
      productData,
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load artist details: ${artistUsername}: ${e.message}`,
    }
  }
}
