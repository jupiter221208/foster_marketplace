import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// next component

// components
import MerchOrderMain from 'components/pages/MerchOrder/MerchOrderMain'
import ArrowLeftIcon from 'assets/icons/arrow-left-24x24.svg?component'

// json

// styles
import styles from './index.module.scss'
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import ImageWithFoster from 'components/ImageWithFoster'
import MerchOrderShipping from 'components/pages/MerchOrder/MerchOrderShipping'
import { useDispatch, useSelector } from 'react-redux'
import MerchOrderShippingMethod from 'components/pages/MerchOrder/ShippingMethod'

// API
import StoreAPI from 'apis/store'

interface MerchOrderPageProps {
  publicArtistData?: any
  error?: string
}

const MerchOrderPage = ({ publicArtistData }: MerchOrderPageProps) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [productDetail, setProductDetail] = useState(null)
  const [shipppingMethod, setShippingMethod] = useState(null)
  const [shippingData, setShippingData] = useState(null)
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
        list.push({ url: merch.url, selected: true })
        setSelectedMerch({ url: merch.url, selected: true })
      } else {
        list.push({ url: merch.url, selected: false })
      }
    })
    setMerchList(list)
  }

  const onClickBuyNow = () => {
    setCurrentStep(2)
  }

  useEffect(() => {
    if (printData) return

    StoreAPI.getStoreById(publicArtistData.artist.id, router.query.product_id).then(
      response => {
        if (response) {
          setProductDetail(response)
          let imageList = [],
            rawList = []
          if (response.fulfillment_type === 'foster') {
            response.options.addons.map((item, index) => {
              imageList.push({ url: item.mockup_url, selected: index === 0 })
              rawList.push({ url: item.raw_url })
            })
            setType('foster')
          } else {
            response.options.product_images.map((item, index) => {
              imageList.push({ url: item, selected: index === 0 })
            })
            if (response.master_edition_address === null) setType('physical')
            else setType('user')
          }
          setMerchList(imageList)
          setRawUrlList(rawList)
          setSelectedMerch(imageList[0])
          setPrintData({
            id: 1,
            quantity: merchQuantity,
            size: merchSize,
            color: response.options.color,
            name: response.name,
            description: response.description,
            technique: response.options.print_technique,
            cost: response.selling_price / 100,
          })
        }
      },
      error => {}
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicArtistData])

  useEffect(() => {
    setPrintData({ ...printData, size: merchSize })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchSize])

  useEffect(() => {
    let newData = { ...printData }
    newData.quantity = merchQuantity
    newData.cost = (productDetail?.selling_price / 100) * merchQuantity
    setPrintData(newData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchQuantity])

  return (
    <div className="g-container flex">
      <div className="mt-[75px]">
        <div className="lg:block hidden">
          <div className={styles.backStore} onClick={() => router.push(`/${router.query.id}/merch`)}>
            <ArrowLeftIcon />
            Back to store
          </div>
        </div>

        <div className="lg:flex hidden w-[130px] flex flex-col gap-[16px] mt-[30px]">
          {merchList.map((merch, index) => {
            return (
              <div
                key={index}
                className={merch.selected ? styles.selected : styles.unselected}
                onClick={() => onClickMerch(index)}
              >
                <ImageWithFoster width={130} height={130} src={merch.url} className="w-full h-full object-cover" />
              </div>
            )
          })}
        </div>
      </div>

      <div className="w-full lg:flex-1 flex flex-wrap justify-between">
        <div className="2xl:w-[58%] lg:w-[55%] w-full flex justify-center lg:px-[20px]">
          <div className={`sm:hidden block h-auto w-full mb-[20px] mt-[${type === 'foster' ? 20 : 0}px]`}>
            <div className={styles.mobileImageArea}>
              <div className={styles.imageArea}>
                <div
                  className={styles.imageContent}
                  style={{
                    background: type === 'physical' ? 'var(--background-main-color)' : 'transparent',
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
          <div className="sm:block hidden sm:w-[640px] sm:h-[640px] lg:w-[700px] lg:h-[700px] mt-[20px] lg:mt-[75px]">
            <div className={styles.imageArea}>
              <div
                className={styles.imageContent}
                style={{
                  background: type === 'physical' ? 'var(--background-main-color)' : 'transparent',
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
                <div
                  key={index}
                  className={merch.selected ? styles.selected : styles.unselected}
                  onClick={() => onClickMerch(index)}
                >
                  <ImageWithFoster width={130} src={merch.url} />
                </div>
              )
            })
          )}
        </div>

        <div className="w-full 2xl:w-[42%] lg:w-[45%] mb-[50px]">
          {currentStep === 1 &&
            (productDetail ? (
              <div className="w-full mt-[0px] lg:mt-[75px]">
                <MerchOrderMain
                  username={router.query.id}
                  type={type}
                  productDetail={productDetail}
                  userDetail={publicArtistData}
                  onClickBuyNow={onClickBuyNow}
                  setQuantity={setMerchQuantity}
                  setMerchSize={setMerchSize}
                />
              </div>
            ) : (
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
            ))}
          {currentStep === 2 && (
            <div className="w-full mt-[0px] lg:mt-[57px]">
              <MerchOrderShipping
                onBack={info => {
                  setShippingData(info)
                  setCurrentStep(1)
                }}
                onNext={info => {
                  setShippingData(info.data)
                  setShippingMethod(info.method)
                  setCurrentStep(3)
                }}
                printData={printData}
                data={shippingData}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div className="w-full mt-[0px] lg:mt-[57px]">
              <MerchOrderShippingMethod
                type={'foster'}
                data={printData}
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
  return <PrimaryLayout>{page}</PrimaryLayout>
}

MerchOrderPage.getInitialProps = async function ({ res, query }): Promise<MerchOrderPageProps> {
  let artistUsername = encodeURIComponent(query.id)

  try {
    let publicArtistData = await fetch(`${process.env.BACKEND_URL}v1/artists/${artistUsername}/username`).then(r =>
      r.json()
    )
    return {
      publicArtistData,
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load artist details: ${artistUsername}: ${e.message}`,
    }
  }
}
