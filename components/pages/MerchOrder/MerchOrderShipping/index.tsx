import React, { useState, useEffect } from 'react'

// next component

// components
import { Country, State } from 'country-state-city'
import CountrySelect from 'components/Select/CountrySelect'
import Alert from 'components/Alert'
import LoadingButton from 'components/Button/LoadingButton'
import { useViewport } from 'utils'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// custom functions
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// styles
import styles from './index.module.scss'

// api
import storeAPI from 'apis/store'
import merchAPI from 'apis/merch'

const MerchOrderShipping = props => {
  const { productId, type, data, onBack, onNext, merchList, rawList } = props
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const [enabled, setEnabled] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
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

  const proceedToCheckout = () => {
    if (!connected) {
      setVisible(true)
      return
    }
    let params

    let item_id = 1
    params = {
      toPostalCode: zipCode,
      toCountry: country.isoCode,
      toState: state.isoCode,
      cartItems: [
        {
          id: item_id.toString(),
          quantity: 1,
          options: {
            size: 'L',
            color: 'black',
            sideOfPrint: 'Front Side',
          },
          notes: `This is apparel item`,
        },
      ],
    }

    setIsLoading(true)
    if (type === 'physical') {
      onCheckout('', 'user') // user fulfilled physical
    } else {
      // type === foster

      merchAPI.prepareCart(params).then(
        response => {
          if (response?.shippingMethods?.length > 0)
            onCheckout(country.isoCode === 'US' ? 'usps_priority_mail' : 'international', 'foster')
          else setIsLoading(false)
        },
        error => {
          setIsLoading(false)
          setShowAlert(true)
        }
      )
    }
  }

  const onCheckout = (serviceCode, type) => {
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

    const { description, color, quantity, size } = data
    let item

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
        type: type,
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

    let params = {
      customerEmail: email,
      shippingServiceCode: serviceCode,
      billTo: address,
      shipTo: address,
      items: [item],
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
        onNext(response.orderNumber)
      },
      error => {
        setIsLoading(false)
      }
    )
  }

  const backToPage = () => {
    let checkout = {
      email,
      country,
      state,
      name,
      city,
      street,
      apartment,
      zipCode,
    }
    onBack(checkout)
  }

  return (
    <div className={styles.container}>
      <div className="w-full">
        <div className={styles.selecteCategory}>Shipping Details</div>

        <div className="w-full mt-[20px]">
          <div className={styles.label}>
            Contact Information <span>*</span>
          </div>
          <div className="w-full mt-[10px]">
            <input
              value={name}
              placeholder="Name"
              className={styles.inputArea}
              onChange={event => setName(event.target.value)}
            />
          </div>
          <div className="w-full mt-[10px]">
            <input
              value={email}
              placeholder="Email"
              className={styles.inputArea}
              onChange={event => setEmail(event.target.value)}
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
              placeholder="Select Country"
            />
          </div>
          <div className="mt-[10px] ">
            <CountrySelect
              className={styles.countrySelect}
              data={State?.getStatesOfCountry(country?.isoCode)}
              selected={state}
              onChange={item => setState(item)}
              maxHeight="none"
              placeholder="Select State"
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
      {/* <div className={styles.borderLine} /> */}
      <div className="w-full mt-[25px]">
        <div className="w-full mt-[22px]">
          {isLoading ? (
            <LoadingButton height={50} fullWidth />
          ) : (
            <GradientButton
              label={'Checkout'}
              height={50}
              disabled={!enabled}
              fullWidth
              onClick={() => proceedToCheckout()}
            />
          )}
        </div>
        <div className="w-full mt-[15px] mb-[22px]">
          <OutlineButton label="Back" onClick={() => backToPage()} fullWidth />
        </div>
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

export default MerchOrderShipping
