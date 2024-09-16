import React, { useState, useEffect } from 'react'

// next components

// components
import { Country, State } from 'country-state-city'
import Alert from 'components/Alert'

// custom functions
import { useViewport } from 'utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useSelector } from 'react-redux'

// images

// styles
import styles from './index.module.scss'
import CountrySelect from 'components/Select/CountrySelect'

// api
import merchAPI from 'apis/merch'
import PrimaryButton from 'components/Button/PrimaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'
import LoadingButton from 'components/Button/LoadingButton'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

const PhysicalShipping = props => {
  const { onBack, onNext, category, data, printData, wallArt, mintAddress, nftName, nftCoverUrl } = props
  const viewport = useViewport()
  const printImageUrl = useSelector(state => (state as any).printImageUrl)

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
      const { apparel, gender, quality, color, print, quantity, size } = printData
      let item_id = apparel[gender.type][quality.type][color.type].item_id
      params = {
        toPostalCode: zipCode,
        toCountry: country.isoCode,
        toState: state.isoCode,
        cartItems: [
          {
            id: item_id.toString(),
            quantity,
            options: {
              size: size.name,
              color: color.type,
              sideOfPrint: print.name,
            },
            notes: `This is apparel ${apparel.description} item`,
          },
        ],
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
          onCheckout(country.isoCode === 'US' ? 'usps_priority_mail' : 'gp_plus')
        } else setIsLoading(false)
      },
      error => {
        setIsLoading(false)
        setShowAlert(true)
      }
    )
  }

  const onCheckout = serviceCode => {
    setIsLoading(true)
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
    const { apparel, gender, quality, color, print, quantity, size } = printData
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

    let item
    if (category === 'apparel') {
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
          apparel: apparel.description,
          size: size.name,
          color: color.type,
          print: print.name,
        },
        notes: `This is apparel ${apparel.description} item`,
      }
    } else {
      let item_id = printData.size.id
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
        notes: `This is wallart ${printData.print.name} item`,
      }
    }

    let params = {
      customerEmail: email,
      shippingServiceCode: serviceCode,
      billTo: address,
      shipTo: address,
      items: [item],
      gift: true,
      giftMessage:
        'Thank you for your order! Your support helps indie creators thrive and fuels innovation in the Solana Art Ecosystem. Enjoy your new piece!',
      notes: 'Checkout Note',
    }

    merchAPI.checkout(params).then(
      response => {
        onNext(response.orderNumber)
        // setIsLoading(false)
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
      {/* <div className="lg:hidden block">
        <div className={styles.wallartBG}>
          <WallSection canvasId="wallart-mobile" nftName={nftName} wallArt={wallArt} finishEditing={true} />
        </div>
      </div> */}
      <div className={styles.rightPanel}>
        <div className="pt-[13px] lg:p-[30px]">
          <div className="flex flex-col lg:flex-row gap-[15px] lg:items-center justify-between">
            <div className={styles.selecteCategory}>Shipping Details</div>
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
              <LoadingButton fullWidth />
            ) : (
              <GradientButton label="Checkout" disabled={!enabled} fullWidth onClick={() => proceedToCheckout()} />
            )}
          </div>
          <div className="mt-[15px] mb-[15px] lg:mb-[30px]">
            <OutlineButton label="Back" onClick={() => backToPage()} fullWidth />
          </div>
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

export default PhysicalShipping
