import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useViewport } from 'utils'
import { useAuthentication } from 'hooks/useAuthentication'
import { dataURLtoFile } from 'utils/helpers'
import uploadFileToS3 from 'apis/aws'

//components
import NewMerchStepper from 'components/NewMerchStepper'
import ProductDetails from './ProductDetails'
import AdditionalDetails from './AdditionalDetails'
import NoNavLayout from 'components/Layout/NoNavLayout'
import GradientButton from 'components/Button/GradientButton'

// images
import ArrowLeft from 'assets/icons/arrow-left-black.svg?component'
import ArrowRightBlack from 'assets/icons/arrow-right-black.svg?component'

// styles
import styles from './index.module.scss'

// apis
import StoreAPI from 'apis/store'
import LoadingButton from 'components/Button/LoadingButton'
import Alert from 'components/Alert'

const NewCreatorMerch = () => {
  const router = useRouter()
  const viewport = useViewport()
  const { profileInfo } = useAuthentication()
  const [currentStep, setCurrentStep] = useState(1)
  const [productDetail, setProductDetail] = useState(null)
  const [nextEnabled, setNextEnabled] = useState(false)
  const [additionDetail, setAdditionDetail] = useState({
    name: '',
    description: '',
    sale_method: '',
    selling_price: 0,
    supply: null,
    sale_start_at: null,
    sale_end_at: null,
  })
  const [isCreating, setIsCreating] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])

  useEffect(() => {
    if (!productDetail) {
      setNextEnabled(false)
      return
    }

    let snapshotUrl = productDetail?.snapshotAssetUrl

    if (snapshotUrl)
      if (
        snapshotUrl.front.length > 0 ||
        snapshotUrl.back.length > 0 ||
        snapshotUrl.left.length > 0 ||
        snapshotUrl.right.length > 0
      ) {
        let { product, description, name, type, shipping } = productDetail
        if (product) {
          if (product.id === 0) {
            setNextEnabled(true)
          } else {
            if (name !== undefined && description !== undefined && type !== undefined && shipping !== undefined)
              setNextEnabled(true)
            else setNextEnabled(false)
          }
        }
      } else setNextEnabled(false)
    else setNextEnabled(false)
  }, [productDetail])

  const uploadApparelSection = async (name: string, imgDataString: string) => {
    let timestamp = new Date().getTime()
    let filename = name.replaceAll(' ', '') + timestamp + '.png'
    var imgFile = dataURLtoFile(imgDataString, filename)
    const { url } = await uploadFileToS3(imgFile, filename)
    return url
  }

  const uploadRawUrl = async (name: string, imageFile: string) => {
    let response = await fetch(imageFile)
    let blob = await response.blob()
    const file = new File([blob], 'avatar.jpg', {
      type: 'image/jpeg',
    })
    let timestamp = new Date().getTime()
    let filename = name.replaceAll(' ', '') + timestamp + '.png'
    const { url } = await uploadFileToS3(file, filename)
    return url
  }

  const getShippingData = () => {
    if (productDetail.shipping.id === 0) return 'di_seller'
    if (productDetail.shipping.id === 1) return 'di_buyer'
    if (productDetail.shipping.id === 2) return 'd_buyer'
    if (productDetail.shipping.id === 3) return 'd_seller'
  }

  const createProduct = async () => {
    // console.log(profileInfo, '==========profileInfo==========')
    // console.log(productDetail, '==========productDetail==========')
    // console.log(additionDetail, '==========additionDetail==========')
    if (profileInfo && additionDetail && productDetail) {
      setIsCreating(true)
      var userId = profileInfo?.id
      let addonList = []

      let snapUrls = productDetail.snapshotAssetUrl

      var params = {}

      if (productDetail.product.id === 0) {
        if (additionDetail.sale_method === 'standalone') {
          // Foster
          try {
            let upload_url = additionDetail.name + '-' + productDetail.selectedCard.id + '-' + productDetail.product.id
            if (snapUrls.front !== '') {
              addonList.push({
                product_addon_id: getProductTypeId() + '-' + 1,
                mockup_url: await uploadApparelSection(upload_url + 'front', snapUrls.front),
                raw_url: await uploadRawUrl(upload_url + 'front' + '_raw', snapUrls.front_raw),
              })
            }
            if (snapUrls.back !== '') {
              addonList.push({
                product_addon_id: getProductTypeId() + '-' + 2,
                mockup_url: await uploadApparelSection(upload_url + 'back', snapUrls.back),
                raw_url: await uploadRawUrl(upload_url + 'back' + '_raw', snapUrls.back_raw),
              })
            }
            if (snapUrls.right !== '') {
              addonList.push({
                product_addon_id: getProductTypeId() + '-' + 3,
                mockup_url: await uploadApparelSection(upload_url + 'right', snapUrls.right),
                raw_url: await uploadRawUrl(upload_url + 'right' + '_raw', snapUrls.right_raw),
              })
            }
            if (snapUrls.left !== '') {
              addonList.push({
                product_addon_id: getProductTypeId() + '-' + 4,
                mockup_url: await uploadApparelSection(upload_url + 'left', snapUrls.left),
                raw_url: await uploadRawUrl(upload_url + 'left' + '_raw', snapUrls.left_raw),
              })
            }
          } catch {
            setIsCreating(false)
            return
          }
          params = {
            name: additionDetail.name,
            description: additionDetail.description,
            fulfillment_type: 'foster',
            product_type_id: getProductTypeId(),
            selling_price: additionDetail.selling_price,
            supply: additionDetail.supply,
            master_edition_address: null,
            sale_start_at: additionDetail.sale_start_at.toISOString().split('.')[0],
            sale_end_at: additionDetail.sale_end_at?.toISOString().split('.')[0],
            options: {
              print_technique: productDetail.technique === 'dtg' ? 'direct_to_garment' : 'embroidery',
              color: productDetail.color,
              addons: addonList,
            },
          }
        } else {
          // Edition
          let upload_url = additionDetail.name + '-' + productDetail.product.id
          try {
            if (snapUrls.front !== '') {
              addonList.push(await uploadApparelSection(upload_url + 'front', snapUrls.front))
            }
            if (snapUrls.back !== '') {
              addonList.push(await uploadApparelSection(upload_url + 'back', snapUrls.back))
            }
            if (snapUrls.right !== '') {
              addonList.push(await uploadApparelSection(upload_url + 'right', snapUrls.right))
            }
            if (snapUrls.left !== '') {
              addonList.push(await uploadApparelSection(upload_url + 'left', snapUrls.left))
            }
          } catch {
            setIsCreating(false)
            return
          }
          params = {
            name: additionDetail.name,
            description: additionDetail.description,
            fulfillment_type: 'user',
            product_type_id: getProductTypeId(),
            selling_price: additionDetail.selling_price,
            supply: null,
            master_edition_address: null,
            sale_start_at: additionDetail.sale_start_at.toISOString().split('.')[0],
            sale_end_at: null,
            options: {
              shipping_responsibility: 'di_seller',
              product_images: addonList,
            },
          }
        }
      } else {
        // Physical User
        try {
          let upload_url = productDetail.name + '-' + productDetail.product.id
          if (snapUrls.front !== '') {
            addonList.push(await uploadRawUrl(upload_url + 'front', snapUrls.front))
          }
          if (snapUrls.back !== '') {
            addonList.push(await uploadRawUrl(upload_url + 'back', snapUrls.back))
          }
          if (snapUrls.right !== '') {
            addonList.push(await uploadRawUrl(upload_url + 'right', snapUrls.right))
          }
          if (snapUrls.left !== '') {
            addonList.push(await uploadRawUrl(upload_url + 'left', snapUrls.left))
          }
        } catch {
          setIsCreating(false)
          return
        }
        params = {
          name: productDetail.name,
          description: productDetail.description,
          fulfillment_type: 'user',
          product_type_id: getProductTypeId(),
          selling_price: additionDetail.selling_price,
          supply: null,
          master_edition_address: null,
          sale_start_at: additionDetail.sale_start_at.toISOString().split('.')[0],
          sale_end_at: additionDetail.sale_end_at?.toISOString().split('.')[0],
          options: {
            shipping_responsibility: getShippingData(),
            product_images: addonList,
          },
        }
      }

      console.log(params, '==========params==========')
      StoreAPI.createProduct(userId, params).then(
        res => {
          if (res) {
            setAlertData([
              {
                id: 0,
                title: 'Product Creation',
                description: 'New project is created successfully.',
                type: 'success',
              },
            ])
            setShowAlert(true)
            router.push(`/${profileInfo.username}/merch`)
          } else {
            setIsCreating(false)
          }
        },
        error => {
          setIsCreating(false)
        }
      )
    }
  }

  const getProductTypeId = () => {
    if (productDetail.product.id === 0) {
      if (productDetail.selectedCard.id === 0) {
        if (productDetail.technique === 'dtg') return 1
        else return 2
      } else if (productDetail.selectedCard.id === 1) {
        if (productDetail.technique === 'dtg') return 3
        else return 4
      } else if (productDetail.selectedCard.id === 2) {
        if (productDetail.technique === 'dtg') return 5
        else return 6
      } else if (productDetail.selectedCard.id === 3) {
        if (productDetail.technique === 'dtg') return 7
        else return 8
      } else if (productDetail.selectedCard.id === 4) {
        if (productDetail.technique === 'dtg') return 9
        else return 10
      }
    } else {
      return 11 + productDetail.type.id
    }
  }

  return (
    <div className="w-full relative">
      <div className={`fixed g-container ${styles.navbar}`} style={{ zIndex: 10001 }}>
        <div className="w-full mt-[20px] h-[60px] lg:mt-[22px] lg:h-[78px] flex justify-between items-start">
          <GradientButton
            icon1={<ArrowLeft />}
            direction="rtl"
            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 105 : 122}
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 44 : 53}
            label="Back"
            borderRadius={30}
            backgroundColor01="var(--place-bid-minimum-color)"
            backgroundColor02="var(--place-bid-minimum-color)"
            color="var(--time-slog-bg)"
            fontFamily="Muli-Regular"
            fontSize={18}
            onClick={() => {
              if (currentStep === 1) {
                let path = window.location.href
                router.push(path.substring(0, path.lastIndexOf('/')))
              } else {
                setCurrentStep(currentStep - 1)
                setNextEnabled(true)
              }
            }}
          />

          <div className="w-[50%] lg:flex hidden">
            <NewMerchStepper currentStep={currentStep} />
          </div>

          {currentStep === 3 && isCreating ? (
            <LoadingButton
              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 105 : 122}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 44 : 53}
              borderRadius={30}
            />
          ) : (
            <GradientButton
              icon1={currentStep === 3 ? '' : <ArrowRightBlack />}
              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 105 : 122}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 44 : 53}
              label={currentStep === 3 ? 'Publish' : 'Next'}
              borderRadius={30}
              backgroundColor01="var(--place-bid-minimum-color)"
              backgroundColor02="var(--place-bid-minimum-color)"
              color="var(--background-main-color)"
              fontFamily="Muli-Regular"
              fontSize={18}
              disabled={!nextEnabled}
              onClick={() => {
                if (currentStep === 3) {
                  // publish API
                  createProduct()
                } else {
                  if (currentStep === 1) setAdditionDetail({ ...additionDetail, sale_start_at: new Date() })
                  setCurrentStep(currentStep + 1)
                }
              }}
            />
          )}
        </div>
      </div>

      <div className="g-container mt-[110px] lg:mt-[165px]">
        {currentStep === 1 && <ProductDetails productDetail={productDetail} setProductDetail={setProductDetail} />}
        {currentStep >= 2 && (
          <AdditionalDetails
            productDetail={productDetail}
            step={currentStep}
            additionDetail={additionDetail}
            setAdditionDetail={setAdditionDetail}
            setEnableNext={setNextEnabled}
          />
        )}
      </div>

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

export default NewCreatorMerch

NewCreatorMerch.getLayout = function getLayout(page) {
  return <NoNavLayout>{page}</NoNavLayout>
}
