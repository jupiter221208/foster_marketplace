import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// next components

// custom functions
import { useViewport } from 'utils'

import Radio from 'components/Radio/SwipRadio'

// images
import ArrowLeftIcon from 'assets/icons/arrow-left-smallest.svg?component'
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import { getFirstUpperString } from 'utils/helpers'
import ShippingSelect from 'components/Select/ShippingSelect'

// api
import merchAPI from 'apis/merch'
import LoadingButton from 'components/Button/LoadingButton'
import OutlineButton from 'components/Button/OutlineButton'

const PhysicalShippingMethod = props => {
  const {
    onBack,
    onNext,
    data,
    shippingData,
    allShippingMethod,
    method,
    selectedMethod,
    nftName,
    nftCoverUrl,
    mintAddress,
    type,
    setTotalCost,
  } = props
  const viewport = useViewport()

  const printImageUrl = useSelector(state => (state as any).printImageUrl)
  const [shipping, setShipping] = useState(null)
  const [shippingMethods, setShippingMethods] = useState([])
  const [tax, setTax] = useState(null)
  const [total, setTotal] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let name = ''
    if (type === 'apparel') {
      name =
        nftName +
        '<br/>' +
        data['apparel'].description +
        ' (' +
        data['size'].name +
        ')' +
        '<br/>' +
        getFirstUpperString(data['color'].type)
    } else {
      name =
        nftName +
        '<br/>' +
        getFirstUpperString(data.print.type) +
        ' (' +
        getFirstUpperString(data.orientation.type) +
        ')<br/>' +
        data.size.width +
        ' x ' +
        data.size.height
    }

    let methods = []
    if (isUniteState()) {
      let ship_methods = allShippingMethod.shippingMethods.filter(
        item =>
          item.serviceName === 'USPS Priority Mail - Package' ||
          item.serviceName === 'USPS Priority Mail Express - Package'
      )
      ship_methods.forEach(method => {
        let newMethod
        if (method.serviceName === 'USPS Priority Mail - Package') {
          newMethod = {
            ...method,
            id: '0',
            label: 'USPS Priority Mail',
            value: method.serviceName,
            disabled: false,
            small_tip: '4-7 business days',
            price: method.shipmentcost,
          }
        } else {
          newMethod = {
            ...method,
            id: '1',
            label: 'USPS Priority Mail Express',
            value: method.serviceName,
            disabled: false,
            small_tip: '1-3 business days',
            price: method.shipmentcost,
          }
        }
        methods.push(newMethod)
      })
    } else {
      let index = 0
      allShippingMethod.shippingMethods
        .filter(item => item.serviceCode === 'usps_priority_mail_international')
        .forEach(method => {
          let newMethod = {
            ...method,
            id: index,
            label: 'USPS Priority Mail International',
            value: method.serviceCode,
            disabled: false,
            price: method.shipmentcost,
          }
          methods.push(newMethod)
          index++
        })
    }
    if (methods?.length > 0) {
      setShippingMethods(methods)
      setShipping(methods[0])
    }
  }, [])

  useEffect(() => {
    if (shipping) {
      let tax = Math.floor((parseFloat(data.cost) + shipping.shipmentCost) * allShippingMethod.taxPercent) / 100
      let total = parseFloat(data.cost) + shipping.shipmentCost + tax
      setTax(tax)
      setTotal(total)
      setTotalCost(total)
    }
  }, [shipping])

  const onCheckout = () => {
    setIsLoading(true)
    let address = {
      name: shippingData.name,
      // company: 'USPS',
      street1: shippingData.street,
      street2: shippingData.apartment,
      street3: '',
      city: shippingData.city,
      state: shippingData.state.isoCode,
      postalCode: shippingData.zipCode,
      country: shippingData.country.isoCode,
      phone: '',
      residential: true,
    }
    const { apparel, gender, quality, color, print, quantity, size } = data
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

    let item
    if (type === 'apparel') {
      let item_id = apparel[gender.type][quality.type][color.type].item_id
      item = {
        id: item_id.toString(),
        // sku: `SKU_${item_id.toString()}`,
        quantity,
        previewUrl: printImageUrl,
        options: {
          type: 'apparel',
          nftName: nftName,
          fosterUrl: `${origin}/nft/${mintAddress}`,
          assetUrl: nftCoverUrl,
          nftAddress: mintAddress,
          size: size.name,
          color: color.type,
          print: print.name,
        },
        notes: `This is apparel ${apparel.description} item`,
      }
    } else {
      let item_id = data.size.id
      item = {
        id: item_id.toString(),
        quantity,
        previewUrl: printImageUrl,
        options: {
          type: 'wallart',
          nftName: nftName,
          fosterUrl: `${origin}/nft/${mintAddress}`,
          assetUrl: nftCoverUrl,
          nftAddress: mintAddress,
          size: `${size.width}x${size.height}`,
        },
        notes: `This is wallart ${data.print.name} item`,
      }
    }

    let params = {
      customerEmail: shippingData.email,
      shippingServiceCode: shipping.serviceCode,
      billTo: address,
      shipTo: address,
      items: [item],
      gift: true,
      giftMessage: 'Fantastic Gift',
      notes: 'Checkout Note',
    }

    merchAPI.checkout(params).then(
      response => {
        onNext(response.orderNumber)
        setIsLoading(false)
      },
      error => {
        setIsLoading(false)
      }
    )
  }

  const isUniteState = () => {
    let country = shippingData['country'].name.toLowerCase()
    return country.includes('united state')
  }

  return (
    <section className={styles.container}>
      <div className="flex gap-[15px] mt-[0px] lg:mt-[20px] items-center">
        <div className={styles.selecteCategory}>Select Shipping Method</div>
      </div>
      <div className="w-full flex xl:flex-row flex-col mt-[20px] justify-between">
        <div className="min-w-[300px] mt-[12px]">
          {shipping && (
            <Radio
              data={shippingMethods}
              selected={shipping}
              onChange={item => {
                setShipping(item)
              }}
            />
          )}
        </div>
        <div className="xl:w-1/2 w-full h-auto gap-[30px] mt-[24px]">
          <div className="w-full relative">
            <div className={styles.orderView}>
              <div className="w-full flex justify-between mt-[20px]">
                <div className={styles.orderTotal}>SUBTOTAL</div>
                <div className={styles.totalPrice}>${data.cost}</div>
              </div>
              <div className={`${styles.divider} mt-[15px]`} />
              <div className="w-full flex justify-between mt-[15px]">
                <div className={styles.orderTotal}>
                  SHIPPING AND
                  <br />
                  HANDLING
                </div>
                <div className={styles.subPrice}>
                  <div>Shipping: ${shipping ? shipping.shipmentCost.toFixed(2) : '---'}</div>
                  <div className="mt-[20px]">Tax: ${tax ? tax.toFixed(2) : '---'}</div>
                </div>
              </div>
              <div className={`${styles.divider} mt-[15px]`} />
              <div className="w-full flex justify-between mt-[20px]">
                <div className={styles.orderTotal}>TOTAL</div>
                <div className={styles.totalPrice}>${total ? total.toFixed(2) : '---'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="xl:absolute xl:bottom-[120px] w-full flex gap-[30px] mt-[30px]">
        <OutlineButton
          label="Back"
          onClick={onBack}
          fullWidth
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
          borderColor={'rgba(var(--main-bg-color-rgb), 0.1)'}
          color={'var(--text-gray-200-color)'}
        />
        <div className="w-full">
          {isLoading ? (
            <LoadingButton fullWidth height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53} />
          ) : (
            <GradientButton
              disabled={!total}
              label="Checkout"
              fullWidth
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
              fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 15 : 18}
              onClick={() => onCheckout()}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default PhysicalShippingMethod
