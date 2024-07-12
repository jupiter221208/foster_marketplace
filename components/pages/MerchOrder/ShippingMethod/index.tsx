import React, { useState, useEffect } from 'react'

// next component

//components
import Radio from 'components/Radio/SwipRadio'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import PrimaryButton from 'components/Button/PrimaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'

// images
// json

// styles
import styles from './index.module.scss'

// api
import storeAPI from 'apis/store'

const MerchOrderShippingMethod = props => {
  const {
    productId,
    type,
    shippingData,
    allShippingMethod,
    data,
    setTotalCost,
    merchList,
    rawList = [],
    mintAddress,
    onNext,
    onBack,
  } = props
  const [shipping, setShipping] = useState(null)
  const [shippingMethods, setShippingMethods] = useState([])
  const [tax, setTax] = useState(null)
  const [total, setTotal] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let methods = []
    if (isUniteState()) {
      let ship_methods = allShippingMethod.shippingMethods.filter(
        item => item.serviceCode === 'usps_priority_mail' || item.serviceCode === 'usps_priority_mail_express'
      )

      let minCostOne = Number.MAX_VALUE
      let minCostTwo = Number.MAX_VALUE
      let minCostMethodOne
      let minCostMethodTwo
      ship_methods.forEach(method => {
        let newMethod

        if (method.serviceCode === 'usps_priority_mail') {
          newMethod = {
            ...method,
            id: '0',
            label: 'USPS Priority Mail',
            value: method.serviceName,
            disabled: false,
            small_tip: '4-7 business days',
            price: method.shipmentCost,
          }
          if (newMethod.price < minCostOne) {
            minCostOne = newMethod.price
            minCostMethodOne = newMethod
          }
        } else {
          newMethod = {
            ...method,
            id: '1',
            label: 'USPS Priority Mail Express',
            value: method.serviceName,
            disabled: false,
            small_tip: '1-3 business days',
            price: method.shipmentCost,
          }
          if (newMethod.price < minCostTwo) {
            minCostTwo = newMethod.price
            minCostMethodTwo = newMethod
          }
        }
      })
      minCostMethodOne.price = minCostOne.toFixed(2)
      minCostMethodTwo.price = minCostTwo.toFixed(2)
      methods.push(minCostMethodOne)
      methods.push(minCostMethodTwo)
    } else {
      let index = 0
      let minCost = Number.MAX_VALUE
      let minCostMethod
      allShippingMethod.shippingMethods
        .filter(item => item.serviceCode === 'usps_priority_mail_international')
        .forEach(method => {
          let newMethod = {
            ...method,
            id: index,
            label: 'USPS Priority Mail International',
            value: method.serviceCode,
            disabled: false,
            price: method.shipmentCost,
          }
          if (newMethod.price < minCost) {
            minCost = newMethod.price
            minCostMethod = newMethod
          }
          index++
        })
      minCostMethod.price = minCost.toFixed(2)
      methods.push(minCostMethod)
    }
    if (methods?.length > 0) {
      setShippingMethods(methods)
      setShipping(methods[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (shipping) {
      let tax = Math.floor((parseFloat(data.cost) + shipping.shipmentCost) * allShippingMethod.taxPercent) / 100
      let total = parseFloat(data.cost) + shipping.shipmentCost + tax

      setTax(tax)
      setTotal(total)
      setTotalCost(total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipping])

  const isUniteState = () => {
    let country = shippingData['country'].name.toLowerCase()
    return country.includes('united state')
  }

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

    const { id, name, description, color, quantity, size } = data
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

    let item
    if (type === 'appparel' || type === 'wallart') {
      item = {
        id: productId.toString(),
        quantity,
        previewUrl: merchList[0].url,
        options: {
          type: 'foster',
          nftName: name,
          fosterUrl: merchList[0].url,
          assetUrl: merchList[0].url,
          nftAddress: mintAddress,
          apparel: description,
          size: size,
          color: color,
        },
        notes: `This is apparel merch V1 item`,
      }
    } else {
      // foster merch
      let mockupUrls = [],
        rawUrls = []
      merchList.map(item => mockupUrls.push(item.url))
      rawList.map(item => rawUrls.push(item.url))
      item = {
        id: productId.toString(),
        quantity,
        previewUrl: mockupUrls[0],
        options: {
          type: 'foster',
          nftName: data.name,
          fosterUrl: window.location.href,
          mockupUrl: mockupUrls.join(','),
          assetUrl: rawUrls.join(','),
          nftAddress: '',
          apparel: description,
          size: size,
          color: color,
          technique: data.technique,
        },
        notes: `This is studio merch V2 item`,
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

    storeAPI.checkout(params).then(
      response => {
        onNext(response.orderNumber)
        // setIsLoading(false)
      },
      error => {
        setIsLoading(false)
      }
    )
  }

  return (
    <div className={styles.container}>
      <div className="w-full lg:px-[30px] lg:h-[540px] pt-[25px] pb-[15px]">
        <div className={styles.selecteCategory}>Shipping Details</div>
        <div className="w-full">
          <div className="w-full min-w-[375px] mt-[12px]">
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
          <div className="w-full h-auto gap-[30px] mt-[24px]">
            <div className="w-full relative">
              <div className={styles.orderView}>
                <div className="w-full flex justify-between">
                  <div className={styles.orderTotal}>Subtotal</div>
                  <div className={styles.totalPrice}>${data.cost}</div>
                </div>
                <div className={`${styles.divider} mt-[15px]`} />
                <div className="w-full flex justify-between mt-[15px]">
                  <div className={styles.orderTotal}>
                    Shipping and
                    <br />
                    Handling
                  </div>
                  <div className={styles.subPrice}>
                    <div>Shipping: ${shipping ? shipping.shipmentCost.toFixed(2) : '---'}</div>
                    <div className="mt-[20px]">Tax: ${tax ? tax.toFixed(2) : '---'}</div>
                  </div>
                </div>
                <div className={`${styles.divider} mt-[15px]`} />
                <div className="w-full flex justify-between mt-[20px]">
                  <div className={styles.orderTotal}>Total</div>
                  <div className={styles.totalPrice}>${total ? total.toFixed(2) : '---'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.borderLine} />
      <div className="w-full lg:px-[30px] mt-[20px]">
        <div className="w-full mt-[20px]">
          {isLoading ? (
            <LoadingPrimaryButton fullWidth />
          ) : (
            <PrimaryButton disabled={!total} label="Checkout" type="buy-now" fullWidth onClick={() => onCheckout()} />
          )}
        </div>
        <div className="w-full mt-[15px] lg:mt-[20px] mb-[20px] lg:mb-[20px] flex">
          <SecondaryButton label="Back" type="back" onClick={onBack} fullWidth />
        </div>
      </div>
    </div>
  )
}

export default MerchOrderShippingMethod
