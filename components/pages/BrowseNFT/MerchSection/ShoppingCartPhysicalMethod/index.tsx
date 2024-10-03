import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// next components

// custom functions
import { useViewport } from 'utils'

import Radio from 'components/Radio/SwipRadio'

// images

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

// api
import merchAPI from 'apis/merch'
import LoadingButton from 'components/Button/LoadingButton'
import OutlineButton from 'components/Button/OutlineButton'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import PrimaryButton from 'components/Button/PrimaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'

const ShoppingCartPhysicalShippingMethod = props => {
  const { onBack, onNext, apparelData, shippingData, allShippingMethod, type, setTotalCost, printData } = props
  const viewport = useViewport()
  const printImageUrl = useSelector(state => (state as any).printImageUrl)
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
      let totalCost = 0
      printData.forEach(item => {
        totalCost += parseFloat(item.cost)
      })
      let tax = Math.floor((totalCost + shipping.shipmentCost * printData.length) * allShippingMethod.taxPercent) / 100
      let total = totalCost + shipping.shipmentCost * printData.length + tax
      setTax(tax)
      setTotal(total)
      setTotalCost(total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

    let item
    if (type === 'apparel') {
      const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

      item = printData.map((itemData, index) => {
        const { apparel, gender, quality, color, print, quantity, size } = itemData
        let item_id = apparel[gender.type][quality.type][color.type].item_id

        return {
          id: item_id.toString(),
          quantity,
          previewUrl: apparelData[index].printImageUrl,
          options: {
            type: 'apparel',
            nftName: apparelData[index].nftName,
            fosterUrl: `${origin}/nft/${apparelData[index].mintAddress}`,
            assetUrl: apparelData[index].nftCoverUrl,
            nftAddress: apparelData[index].mintAddress,
            apparel: apparel.description,
            size: size.name,
            color: color.type,
            print: print.name,
          },
          notes: `This is apparel ${apparel.description} item`,
        }
      })
    } else {
      item = printData.map((itemData, index) => {
        const { apparel, gender, quality, color, print, quantity, size } = itemData
        let item_id = apparel[gender.type][quality.type][color.type].item_id

        return {
          id: item_id.toString(),
          quantity,
          previewUrl: printImageUrl,
          options: { ...apparelData[index] },
          notes: `This is apparel ${apparel.description} item`,
        }
      })
    }

    let params = {
      customerEmail: shippingData.email,
      shippingServiceCode: shipping.serviceCode,
      billTo: address,
      shipTo: address,
      items: item,
      gift: true,
      giftMessage: 'Thank you for supporting indie creators in the Solana Art Ecosystem. Enjoy your new piece!',
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
      <div className="pt-[75px]">
        <div className="flex gap-[15px] mt-[0px] lg:mt-[0px] items-center">
          <div className={styles.selecteCategory}>Select Shipping Method</div>
        </div>
        <div className="w-full mt-[20px] justify-between">
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
          <div className="w-full h-auto gap-[30px] mt-[24px]">
            <div className="w-full relative">
              <div className={styles.orderView}>
                <div className="w-full flex justify-between">
                  <div className={styles.orderTotal}>Subtotal</div>
                  <div className={styles.totalPrice}>
                    ${printData.reduce((totalCost, item) => totalCost + parseFloat(item.cost), 0).toFixed(2)}
                  </div>
                </div>
                <div className={`${styles.divider} mt-[15px]`} />
                <div className="w-full flex justify-between mt-[15px]">
                  <div className={styles.orderTotal}>Shipping and Handling</div>
                  <div className={styles.subPrice}>
                    <div>Shipping: ${shipping ? (shipping.shipmentCost * printData.length).toFixed(2) : '---'}</div>
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
      <div className={styles.btnContainer}>
        <div className="w-full mt-[20px]">
          {isLoading ? (
            <LoadingButton height={50} fullWidth />
          ) : (
            <GradientButton
              disabled={!total}
              label={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'Checkout' : 'Proceed to Checkout'}
              fullWidth
              onClick={() => onCheckout()}
            />
          )}
        </div>
        <div className="w-full mt-[15px] lg:mt-[20px] mb-[20px] lg:mb-[20px] flex">
          <OutlineButton label="Back" backgroundColor="var(--bg-212121-F3F2F0)" onClick={onBack} fullWidth />
        </div>
      </div>
    </section>
  )
}

export default ShoppingCartPhysicalShippingMethod
