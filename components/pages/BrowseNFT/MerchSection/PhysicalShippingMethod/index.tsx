import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// next components

// custom functions
import { useViewport } from 'utils'

// images
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import { getFirstUpperString } from 'utils/helpers'
import ShippingSelect from 'components/Select/ShippingSelect'

// api
import merchAPI from 'apis/merch'
import LoadingButton from 'components/Button/LoadingButton'

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
  const [shippingMethods, setShippingMethods] = useState(null)
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

    if (isUniteState()) {
      let methods = allShippingMethod.shippingMethods.filter(
        item =>
          item.serviceName === 'USPS Priority Mail - Package' ||
          item.serviceName === 'USPS Priority Mail Express - Package'
      )
      setShippingMethods(methods)
    }
  }, [])

  useEffect(() => {
    if (shipping) {
      let tax = Math.floor(shipping.shipmentCost * allShippingMethod.taxPercent) / 100
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
      company: 'USPS',
      street1: shippingData.street,
      street2: '',
      street3: '',
      city: shippingData.city,
      state: shippingData.state.isoCode,
      postalCode: shippingData.zipCode,
      country: shippingData.country.isoCode,
      phone: '+1(555)-555-5555',
      residential: true,
    }
    const { apparel, gender, quality, color, print, quantity, size } = data
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

    let item_id = apparel[gender.type][quality.type][color.type].item_id
    let item = {
      id: item_id.toString(),
      // sku: `SKU_${item_id.toString()}`,
      // name: nftName,
      quantity,
      previewUrl: nftCoverUrl,
      options: {
        fosterUrl: `${origin}/nft/${mintAddress}`,
        imageUrl: nftCoverUrl,
        nftAddress: mintAddress,
        gender: gender.name,
        size: size.name,
        color: color.type,
        print: print.name,
      },
      notes: `This is apparel ${apparel.description} item`,
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
      // paymentMethod: '',
    }
    console.log(params)
    merchAPI.checkout(params).then(
      response => {
        console.log(response)
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
      <div className="flex gap-[15px] mt-[20px] items-center">
        <div className={styles.backBG} onClick={onBack}>
          <div className="hidden lg:flex">
            <ArrowLeftIcon alt="" />
          </div>
          <div className="flex lg:hidden">
            <ArrowLeftIconMobile alt="" />
          </div>
        </div>
        <div className={styles.selecteCategory}>Select Shipping Method</div>
      </div>
      <div className="mt-[45px]">
        <div className={styles.shippingMethod}>Shipping Method*</div>
      </div>
      <div className="mt-[12px]">
        <ShippingSelect
          data={shippingMethods}
          selected={shipping}
          onChange={item => setShipping(item)}
          maxHeight="none"
        />
      </div>
      <div className="w-full h-auto gap-[30px] mt-[24px]">
        <div className="w-full h-[330px] relative">
          <div className={styles.orderView}>
            <div className="w-full flex items-center gap-[10px] -ml-[11px]">
              <div className={styles.orderTicket}></div>
              <div className={styles.orderTotal}>ORDER TOTAL</div>
            </div>
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
                {/* <div className="mt-[20px]">Handling Fee: ${shipping ? shipping.otherCost : '---'}</div> */}
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

      <div className="w-full mt-[30px]">
        {isLoading ? (
          <LoadingButton fullWidth height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53} />
        ) : (
          <GradientButton
            disabled={!total}
            label="Proceed to Checkout"
            fullWidth
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
            fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 15 : 18}
            onClick={() => onCheckout()}
          />
        )}
      </div>
    </section>
  )
}

export default PhysicalShippingMethod
