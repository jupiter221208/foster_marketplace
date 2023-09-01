import React, { useState, useEffect } from 'react'

// next components

// components
import { Country, State } from 'country-state-city'

// custom functions
import { useViewport } from 'utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// images
import ArrowLeftIcon from 'assets/icons/arrow-left-smallest.svg?component'
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'
import LoadingButton from 'components/Button/LoadingButton'
import Alert from 'components/Alert'

// styles
import styles from './index.module.scss'
import CountrySelect from 'components/Select/CountrySelect'
import GradientButton from 'components/Button/GradientButton'

// api
import merchAPI from 'apis/merch'
import OutlineButton from 'components/Button/OutlineButton'
import WallSection from '../MerchWallArtSection/WallSection'

const PhysicalShipping = props => {
  const { onBack, onNext, category, data, printData, wallArt, nftName } = props
  const viewport = useViewport()
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
        onNext({ data, method: response })
        setIsLoading(false)
      },
      error => {
        setIsLoading(false)
        setShowAlert(true)
      }
    )
  }

  useEffect(() => {
    if (country && shipping === null) {
      setState(null)
    }
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

      <div className="flex gap-[15px] mt-[20px] items-center">
        <div className={styles.selecteCategory}>Add Shipping Details</div>
      </div>
      <div className="w-full mt-[20px]">
        <div className={styles.label}>Contact Information *</div>
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
        <div className={styles.label}>Shipping Address *</div>
        <div className="mt-[10px] ">
          <CountrySelect
            data={Country.getAllCountries()}
            selected={country}
            onChange={item => setCountry(item)}
            maxHeight="none"
            placeholder="Country"
          />
        </div>
        <div className="mt-[10px] ">
          <CountrySelect
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
      <div className="w-full flex mt-[20px] gap-[30px] mb-[30px]">
        <OutlineButton
          label="Back"
          onClick={() => backToPage()}
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
              disabled={!enabled}
              label="Select Shipping"
              fullWidth
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
              fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 15 : 18}
              onClick={() => proceedToCheckout()}
            />
          )}
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
