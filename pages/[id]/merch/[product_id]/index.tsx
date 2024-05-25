import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// next component

// components
import MerchOrderMain from 'components/pages/MerchOrder/MerchOrderMain'

// images
import merchImageFront from 'assets/images/merch-order-front.png'
import merchImageBack from 'assets/images/merch-order-back.png'
import merchImageLeft from 'assets/images/merch-order-left.png'

import physicalImageFront from 'assets/images/merch-physical-front.jpg'
import physicalImageBack from 'assets/images/merch-physical-back.jpg'
import physicalImageRight from 'assets/images/merch-physical-right.jpg'
import physicalImageLeft from 'assets/images/merch-physical-left.jpg'
// json

// styles
import styles from './index.module.scss'
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import ImageWithFoster from 'components/ImageWithFoster'
import MerchOrderShipping from 'components/pages/MerchOrder/MerchOrderShipping'
import { useDispatch, useSelector } from 'react-redux'
import MerchOrderShippingMethod from 'components/pages/MerchOrder/ShippingMethod'

interface MerchOrderPageProps {
  username?: string
  error?: string
}

const MerchOrderPage = ({ username }: MerchOrderPageProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const type = useSelector(state => (state as any).merchOrderType)
  const [shipppingMethod, setShippingMethod] = useState(null)
  const [shippingData, setShippingData] = useState(null)
  const [printData, setPrintData] = useState({
    id: 1,
    cost: '56.4',
    quantity: 1,
    size: 'L',
    color: 'white',
    name: 'product_name1',
    description: 'Unisex Premium Hoodie | Cotton Heritage M2580 | Embroidery | White',
  })
  const [totalCost, setTotalCost] = useState(null)

  const [merchList, setMerchList] = useState([])
  const [selectedMerch, setSelectedMerch] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)

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
    if (type === 'merch') {
      setMerchList([
        {
          url: merchImageFront,
          selected: true,
        },
        {
          url: merchImageBack,
          selected: false,
        },
        {
          url: merchImageLeft,
          selected: false,
        },
      ])
      setSelectedMerch({
        url: merchImageFront,
        selected: true,
      })
    } else {
      setMerchList([
        {
          url: physicalImageFront,
          selected: true,
        },
        {
          url: physicalImageBack,
          selected: false,
        },
        {
          url: physicalImageRight,
          selected: false,
        },
        {
          url: physicalImageLeft,
          selected: false,
        },
      ])
      setSelectedMerch({
        url: physicalImageFront,
        selected: true,
      })
    }
  }, [type])

  return (
    <div className="g-container flex gap-[50px] ">
      <div className="lg:flex hidden w-[130px] flex flex-col gap-[16px] mt-[75px]">
        {merchList.map((merch, index) => {
          return (
            <div
              key={index}
              className={merch.selected ? styles.selected : styles.unselected}
              onClick={() => onClickMerch(index)}
            >
              <ImageWithFoster width={130} height={130} src={merch.url.src} className="w-full h-full" />
            </div>
          )
        })}
      </div>
      <div className="w-full lg:flex-1 flex lg:flex-row flex-col justify-between">
        <div className="lg:w-[48%] w-full flex justify-center">
          <div className="w-[375px] h-[375px] sm:w-[640px] sm:h-[640px] lg:h-[700px] mt-[20px] lg:mt-[75px]">
            <div className={styles.imageArea}>
              <div className={styles.imageContent}>
                <ImageWithFoster width={700} src={selectedMerch ? selectedMerch.url.src : ''} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:hidden flex gap-[9px] sm:gap-[15px] mt-[0px] sm:mt-[30px]">
          {merchList.map((merch, index) => {
            return (
              <div
                key={index}
                className={merch.selected ? styles.selected : styles.unselected}
                onClick={() => onClickMerch(index)}
              >
                <ImageWithFoster width={130} src={merch.url.src} />
              </div>
            )
          })}
        </div>

        <div className="w-full lg:w-[42%]">
          {currentStep === 1 && (
            <div className="w-full mt-[0px] lg:mt-[75px]">
              <MerchOrderMain username={username} type={type} onClickBuyNow={onClickBuyNow} />
            </div>
          )}
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
                type={type}
                data={printData}
                shippingData={shippingData}
                allShippingMethod={shipppingMethod}
                setTotalCost={setTotalCost}
                merchList={merchList}
                mintAddress="0xE3f338g2dk3f82qdk333dee333dd33"
                onNext={orderId => {
                  let data = {
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
  let username = encodeURIComponent(query.id)

  try {
    // let publicArtistData = await fetch(`${process.env.BACKEND_URL}v1/artists/${artistUsername}/username`).then(r =>
    //   r.json()
    // )
    // let artistPublicKey = publicArtistData.artist.wallet_id
    // return {
    //   artistPublicKey,
    //   publicArtistData,
    // }
    return { username }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load artist details: ${username}: ${e.message}`,
    }
  }
}
