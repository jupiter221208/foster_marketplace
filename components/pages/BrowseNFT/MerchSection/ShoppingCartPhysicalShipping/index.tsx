import React, { useState, useEffect } from 'react'

// next components

// components
import { Country, State } from 'country-state-city'
import { useRouter } from 'next/router'

// custom functions
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// images
import LoadingButton from 'components/Button/LoadingButton'
import Alert from 'components/Alert'
import ArrowLeftIcon from 'assets/icons/arrow-left-24x24.svg?component'

// styles
import styles from './index.module.scss'
import CountrySelect from 'components/Select/CountrySelect'

// api
import merchAPI from 'apis/merch'
import storeAPI from 'apis/store'
import { useDispatch } from 'react-redux'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

const ShoppingCartPhysicalShipping = props => {
  const { cartVersion, onBack, onNext, category, data, printData, wallArt, nftName } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const [enabled, setEnabled] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [shipping, setShipping] = useState(data)
  const [apartment, setApartment] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState(null)
  const [state, setState] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const alertData = [
    {
      id: 0,
      title: 'Shipping Method Failure',
      description: `You didn't find shipping method!`,
      type: 'failure',
    },
  ]

  useEffect(() => {
    window.scrollTo({
      top: 0,
    })
  }, [])

  useEffect(() => {
    if (shipping) {
      setEmail(shipping.email)
      setCountry(shipping.country)
      setState(shipping.state)
      setName(shipping.name)
      setCity(shipping.city)
      setStreet(shipping.street)
      setApartment(shipping.apartment)
      setZipCode(shipping.zipCode)
    }
  }, [shipping])

  const backToPage = () => {
    router.push('/')
  }

  const proceedToCheckout = () => {
    if (!connected) {
      setVisible(true)
      return
    }
    let data = {
      email,
      country,
      state,
      name,
      city,
      street,
      apartment,
      zipCode,
    }

    let params
    if (category === 'apparel') {
      const cartItems = []

      printData.forEach(item => {
        if (cartVersion === 'v2') {
          cartItems.push({
            id: '1',
            quantity: 1,
            options: {
              size: 'L',
              color: 'white',
              sideOfPrint: 'Front Side',
            },
            notes: `This is apparel item`,
          })
        } else {
          const { apparel, gender, quality, color, print, quantity, size } = item
          let item_id = apparel[gender.type][quality.type][color.type].item_id
          cartItems.push({
            id: item_id.toString(),
            quantity,
            options: {
              size: size.name,
              color: color.type,
              sideOfPrint: print.name,
            },
            notes: `This is apparel ${apparel.description} item`,
          })
        }
      })

      params = {
        toPostalCode: zipCode,
        toCountry: country.isoCode,
        toState: state.isoCode,
        cartItems,
      }
    } else {
      const { print, quantity, size } = printData
      let item_id = size.id
      params = {
        toPostalCode: zipCode,
        toCountry: country.isoCode,
        toState: state.isoCode,
        cartItems: [
          {
            id: item_id.toString(),
            quantity,
            options: {
              size: `${size.width}x${size.height}`,
            },
            notes: `This is wallart ${print.name} item`,
          },
        ],
      }
    }

    setIsLoading(true)

    merchAPI.prepareCart(params).then(
      response => {
        if (response?.shippingMethods?.length > 0) {
          if (printData[0].version === 'v2')
            onCheckoutV2(country.isoCode === 'US' ? 'usps_priority_mail' : 'international')
          else {
            onNext({ data, method: response })
            setIsLoading(false)
          }
        } else setIsLoading(false)
      },
      error => {
        setIsLoading(false)
        setShowAlert(true)
      }
    )
  }

  const onCheckoutV2 = serviceCode => {
    let address = {
      name: name,
      street1: street,
      street2: apartment,
      street3: '',
      city: city,
      state: state.isoCode,
      postalCode: zipCode,
      country: country.isoCode,
      phone: '',
      residential: true,
    }

    let items = [],
      totalCost = 0
    // foster merch
    printData.map(merch => {
      let storeItem = merch
      let mockupUrls = [],
        rawUrls = []
      storeItem.merchList.map(item => mockupUrls.push(item.url))
      storeItem.rawList.map(item => rawUrls.push(item.url))
      let item = {
        id: storeItem.productId.toString(),
        quantity: storeItem.data.quantity,
        previewUrl: mockupUrls[0],
        options: {
          type: storeItem.type,
          nftName: storeItem.data.name,
          fosterUrl: storeItem.fosterUrl,
          mockupUrl: mockupUrls.join(','),
          assetUrl: rawUrls.join(','),
          nftAddress: '',
          apparel: storeItem.data.description,
          size: storeItem.data.size,
          color: storeItem.data.color,
          technique: storeItem.data.technique,
        },
        notes: `This is studio merch V2 item`,
      }
      totalCost += storeItem.cost * storeItem.data.quantity
      items.push(item)
    })

    let params = {
      customerEmail: email,
      shippingServiceCode: serviceCode,
      billTo: address,
      shipTo: address,
      items: items,
      gift: true,
      giftMessage: 'Thank you for supporting indie creators in the Solana Art Ecosystem. Enjoy your new piece!',
      notes: 'Checkout Note',
    }

    storeAPI.checkout(params).then(
      response => {
        if (response.orderNumber === undefined) {
          setIsLoading(false)
          return
        }

        let data = {
          username: router.query.id,
        }
        dispatch({ type: 'set', merchData: data })
        router.push(`/orders/${response.orderNumber}`)
      },
      error => {
        setIsLoading(false)
      }
    )
  }

  useEffect(() => {
    if (country && shipping === null) {
      setState(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country])

  useEffect(() => {
    if (email.length == 0) {
      setEnabled(false)
      return
    }
    if (!country) {
      setEnabled(false)
      return
    }
    if (!state) {
      setEnabled(false)
      return
    }
    if (name.length == 0) {
      setEnabled(false)
      return
    }
    if (city.length == 0) {
      setEnabled(false)
      return
    }
    if (street.length == 0) {
      setEnabled(false)
      return
    }
    if (zipCode.length == 0) {
      setEnabled(false)
      return
    }
    setEnabled(true)
  }, [email, country, state, name, city, street, zipCode])

  return (
    <section className={styles.container}>
      <div className="lg:pt-[70px]">
        <div className="flex gap-[15px] mt-[20px] lg:mt-[0px] lg:items-center gap-[11px]">
          <ArrowLeftIcon />

          <div className={styles.selecteCategory}>Shipping Address</div>
        </div>
        <div className="w-full mt-[20px]">
          <div className={styles.label}>
            Contact Information <span>*</span>
          </div>
          <div className="w-full mt-[10px]">
            <input
              value={email}
              placeholder="Email"
              className={styles.inputArea}
              onChange={event => setEmail(event.target.value)}
            />
          </div>
          <div className="w-full mt-[10px]">
            <input
              value={name}
              placeholder="Name"
              className={styles.inputArea}
              onChange={event => setName(event.target.value)}
            />
          </div>
        </div>
        <div className="w-full mt-[10px]">
          <div className={styles.label}>
            Shipping Address <span>*</span>
          </div>
          <div className="mt-[10px] ">
            <CountrySelect
              className={styles.countrySelect}
              data={Country.getAllCountries()}
              selected={country}
              onChange={item => setCountry(item)}
              maxHeight="none"
              placeholder="Country"
            />
          </div>
          <div className="mt-[10px] ">
            <CountrySelect
              className={styles.countrySelect}
              data={State?.getStatesOfCountry(country?.isoCode)}
              selected={state}
              onChange={item => setState(item)}
              maxHeight="none"
              placeholder="State"
            />
          </div>

          <div className="w-full mt-[10px]">
            <input
              value={city}
              placeholder="City"
              className={styles.inputArea}
              onChange={event => setCity(event.target.value)}
            />
          </div>
          <div className="w-full mt-[10px]">
            <input
              value={street}
              placeholder="Street"
              className={styles.inputArea}
              onChange={event => setStreet(event.target.value)}
            />
          </div>
          <div className="w-full mt-[10px]">
            <input
              value={zipCode}
              placeholder="ZIP Code"
              className={styles.inputArea}
              onChange={event => setZipCode(event.target.value)}
            />
          </div>
          <div className="w-full mt-[10px]">
            <input
              value={apartment}
              placeholder="Apartment / Suite"
              className={styles.inputArea}
              onChange={event => setApartment(event.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <div className="w-full mt-[15px] lg:mt-[30px]">
          {isLoading ? (
            <LoadingButton height={50} fullWidth />
          ) : (
            <GradientButton label="Checkout" disabled={!enabled} fullWidth onClick={() => proceedToCheckout()} />
          )}
        </div>
        <div className="mt-[15px] mb-[15px] lg:mb-[30px]">
          <OutlineButton label="Back" type="back" onClick={() => backToPage()} fullWidth />
        </div>
      </div>

      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </section>
  )
}

export default ShoppingCartPhysicalShipping
