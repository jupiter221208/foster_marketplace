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
  const [backClicked, setBackClicked] = useState(false)

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
        let { product, description, name, type, country, shipping, sizes, shippingFee, interShippingFee } =
          productDetail
        if (product) {
          if (product.id === 0) {
            setNextEnabled(true)
          } else {
            if (name !== undefined && description !== undefined && type !== undefined && shipping !== undefined) {
              if ((type.id === 12 || type.id === 13) && sizes.length === 0) {
                setNextEnabled(false)
              } else if (shipping.id === 1) {
                if (
                  country !== undefined &&
                  shippingFee !== undefined &&
                  interShippingFee !== undefined &&
                  parseInt(shippingFee) >= 0 &&
                  parseInt(interShippingFee) >= 0
                )
                  setNextEnabled(true)
                else setNextEnabled(false)
              } else setNextEnabled(true)
            } else setNextEnabled(false)
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
    if (productDetail.shipping.id === 1) return 'd_seller'
  }

  const getProductAddonId = side => {
    let addonId = 1
    switch (productDetail.selectedCard.id) {
      case 8:
        if (productDetail.technique === 'dtf') {
          if (side === 'front') addonId = 1
          else if (side === 'back') addonId = 2
          else if (side === 'right') addonId = 3
          else if (side === 'left') addonId = 4
        } else {
          if (side === 'front') addonId = 1
          else if (side === 'right') addonId = 2
          else if (side === 'left') addonId = 3
        }
        break
      case 11:
        if (side === 'front') addonId = 1
        else if (side === 'right') addonId = 2
        break
      case 12:
        if (side === 'front') addonId = 1
        else if (side === 'back') addonId = 2
        else if (side === 'right') addonId = 3
        else if (side === 'left') addonId = 4
        break
      default:
        if (side === 'front') addonId = 1
        else if (side === 'back') addonId = 2
        else if (side === 'right') addonId = 3
        else if (side === 'left') addonId = 4
        break
    }
    return addonId
  }

  const createProduct = async () => {
    if (profileInfo && additionDetail && productDetail) {
      setIsCreating(true)
      var userId = profileInfo?.id
      let addonList = []

      let snapUrls = productDetail.snapshotAssetUrl

      var params = {}

      let productName = ''
      if (productDetail.product.id === 0) {
        // Foster
        try {
          let upload_url = additionDetail.name + '-' + productDetail.selectedCard.id + '-' + productDetail.product.id
          if (snapUrls.front !== '') {
            addonList.push({
              product_addon_id: getProductAddonId('front'),
              mockup_url: await uploadApparelSection(upload_url + 'front', snapUrls.front),
              raw_url: await uploadRawUrl(upload_url + 'front' + '_raw', snapUrls.front_raw),
            })
          }
          if (snapUrls.back !== '') {
            addonList.push({
              product_addon_id: getProductAddonId('back'),
              mockup_url: await uploadApparelSection(upload_url + 'back', snapUrls.back),
              raw_url: await uploadRawUrl(upload_url + 'back' + '_raw', snapUrls.back_raw),
            })
          }
          if (snapUrls.right !== '') {
            addonList.push({
              product_addon_id: getProductAddonId('right'),
              mockup_url: await uploadApparelSection(upload_url + 'right', snapUrls.right),
              raw_url: await uploadRawUrl(upload_url + 'right' + '_raw', snapUrls.right_raw),
            })
          }
          if (snapUrls.left !== '') {
            addonList.push({
              product_addon_id: getProductAddonId('left'),
              mockup_url: await uploadApparelSection(upload_url + 'left', snapUrls.left),
              raw_url: await uploadRawUrl(upload_url + 'left' + '_raw', snapUrls.left_raw),
            })
          }
        } catch {
          setIsCreating(false)
          return
        }
        productName = additionDetail.name
        params = {
          name: additionDetail.name,
          description: additionDetail.description,
          fulfillment_type: 'foster',
          product_type_id: getProductTypeId(),
          selling_price: Math.floor(additionDetail.selling_price * 100),
          supply: additionDetail.sale_method === 'standalone' ? additionDetail.supply : null,
          master_edition_address: additionDetail.sale_method === 'standalone' ? null : '',
          sale_start_at: additionDetail.sale_start_at.toISOString().split('.')[0],
          sale_end_at:
            additionDetail.sale_method === 'standalone'
              ? additionDetail.sale_end_at?.toISOString().split('.')[0]
              : null,
          options: {
            print_technique: productDetail.technique === 'dtg' ? 'direct_to_garment' : 'embroidery',
            color: productDetail.color,
            addons: addonList,
          },
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

        productName = productDetail.name

        let options = {
          shipping_responsibility: getShippingData(),
          product_images: addonList,
        }
        if (productDetail.type.id === 12 || productDetail.type.id === 13) {
          options['sizes'] = productDetail.sizeList
        }
        if (productDetail.shipping.id === 1) {
          let countryCode = productDetail.country.isoCode
          let shippingConfig = {
            blink: productDetail.interShippingFee * 100,
            default: productDetail.interShippingFee * 100,
          }
          shippingConfig[countryCode] = productDetail.shippingFee * 100
          options['shipping_config'] = shippingConfig
        }

        params = {
          name: productDetail.name,
          description: productDetail.description,
          fulfillment_type: 'user',
          product_type_id: getProductTypeId(),
          selling_price: Math.floor(additionDetail.selling_price * 100),
          supply: additionDetail.supply,
          master_edition_address: null,
          sale_start_at: additionDetail.sale_start_at.toISOString().split('.')[0],
          sale_end_at: additionDetail.sale_end_at?.toISOString().split('.')[0],
          options: options,
        }
      }
      console.log(params, '==========params===========')

      setIsCreating(false)
      return

      StoreAPI.createProduct(userId, params).then(
        res => {
          if (res) {
            setAlertData([
              {
                id: 0,
                title: 'Product Created!',
                description: `${productName} has been successfully added to your store.`,
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
      } else if (productDetail.selectedCard.id === 5) {
        return 28
      } else if (productDetail.selectedCard.id === 6) {
        return 29
      } else if (productDetail.selectedCard.id === 7) {
        return 30
      } else if (productDetail.selectedCard.id === 8) {
        if (productDetail.technique === 'dtf') return 25
        else return 26
      } else if (productDetail.selectedCard.id === 9) {
        if (productDetail.technique === 'dtf') return 22
        else return 23
      } else if (productDetail.selectedCard.id === 10) {
        if (productDetail.technique === 'dtf') return 31
        else return 32
      } else if (productDetail.selectedCard.id === 11) {
        return 33
      } else if (productDetail.selectedCard.id === 12) {
        return 27
      } else if (productDetail.selectedCard.id === 13) {
        if (productDetail.technique === 'dtg') return 38
        else return 39
      } else if (productDetail.selectedCard.id === 14) {
        if (productDetail.technique === 'dtg') return 36
        else return 37
      } else if (productDetail.selectedCard.id === 15) {
        if (productDetail.technique === 'dtg') return 34
        else return 35
      } else if (productDetail.selectedCard.id === 16) {
        return 40
      } else if (productDetail.selectedCard.id === 17) {
        return 41
      } else if (productDetail.selectedCard.id === 18) {
        return 42
      } else if (productDetail.selectedCard.id === 19) {
        return 43
      }
    } else {
      return productDetail.type.id
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
                setBackClicked(true)
                setTimeout(() => {
                  setBackClicked(false)
                }, 500)
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

      <div className="">
        {currentStep === 1 && (
          <ProductDetails productDetail={productDetail} setProductDetail={setProductDetail} backClicked={backClicked} />
        )}
        {currentStep >= 2 && (
          <div className="g-container mt-[110px] lg:mt-[165px]">
            <AdditionalDetails
              username={profileInfo?.username}
              productDetail={productDetail}
              step={currentStep}
              additionDetail={additionDetail}
              backClicked={backClicked}
              setAdditionDetail={setAdditionDetail}
              setEnableNext={setNextEnabled}
            />
          </div>
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
