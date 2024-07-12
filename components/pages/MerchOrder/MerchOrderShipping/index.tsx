import React, { useState, useEffect } from 'react'

// next component

// components
import { Country, State } from 'country-state-city'
import PrimaryButton from 'components/Button/PrimaryButton'
import CountrySelect from 'components/Select/CountrySelect'
import SecondaryButton from 'components/Button/SecondaryButton'
import Alert from 'components/Alert'

// custom functions
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// images

// json

// styles
import styles from './index.module.scss'

// api
import merchAPI from 'apis/store'
import storeAPI from 'apis/store'

import LoadingButton from 'components/Button/LoadingButton'

const MerchOrderShipping = props => {
  const { type, data, onBack, onNext, onNextOrder, merchList, rawList } = props
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
    if (country.isoCode === 'US') {
      merchAPI.prepareCart(params).then(
        response => {
          onNext({ data, method: response })
          setIsLoading(false)
        },
        error => {
          setIsLoading(false)
          setShowAlert(true)
        }
      )
    } else {
      onCheckout('usps_priority_mail_international')
    }
  }

  const onCheckout = serviceCode => {
    let address = {
      name: name,
      // company: 'USPS',
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

    const { id, description, color, quantity, size } = data
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

    let item

    // foster merch
    let mockupUrls = [],
      rawUrls = []
    merchList.map(item => mockupUrls.push(item.url))
    rawList.map(item => rawUrls.push(item.url))
    item = {
      id: id.toString(),
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
      giftMessage: 'Fantastic Gift',
      notes: 'Checkout Note',
    }

    console.log(params, '===========params==========')

    storeAPI.checkout(params).then(
      response => {
        onNextOrder(response.orderNumber)
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
      <div className="w-full lg:px-[30px] pt-[25px] pb-[15px]">
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
      <div className={styles.borderLine} />
      <div className="w-full lg:px-[30px] mt-[20px]">
        <div className="w-full mt-[22px]">
          {isLoading ? (
            <LoadingButton height={50} fullWidth />
          ) : (
            <PrimaryButton
              label="Select Shipping"
              type="shipping"
              disabled={!enabled}
              fullWidth
              onClick={() => proceedToCheckout()}
            />
          )}
        </div>
        <div className="w-full mt-[15px] mb-[22px]">
          <SecondaryButton label="Back" type="back" onClick={() => backToPage()} fullWidth />
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
