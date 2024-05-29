import React, { useState, useEffect } from 'react'

// next component

// components
import { Country, State } from 'country-state-city'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import PrimaryButton from 'components/Button/PrimaryButton'
import CountrySelect from 'components/Select/CountrySelect'
import SecondaryButton from 'components/Button/SecondaryButton'
import Alert from 'components/Alert'

// custom functions
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// images
import CloseIcon from 'assets/icons/close-wallet.svg?component'

// json

// styles
import styles from './index.module.scss'

// api
import merchAPI from 'apis/merch'
import DropdownSizeMenu from 'components/Menu/DropdownSizeMenu'

const MerchClaimShipping = props => {
  const { onClose, onNext } = props
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
  const sizeList = [
    { id: 0, label: 'S' },
    { id: 1, label: 'M' },
    { id: 2, label: 'L' },
    { id: 3, label: 'XL' },
    { id: 4, label: '2XL' },
  ]
  const [size, setSize] = useState(sizeList[0])

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

  return (
    <div className={styles.container}>
      <div className="w-full px-[16px] lg:px-[30px] pt-[30px] lg:pt-[25px] pb-[15px]">
        <div className="w-full flex justify-between">
          <div className={styles.selecteCategory}>Shipping Details</div>
          <div onClick={onClose}>
            <CloseIcon alt="" />
          </div>
        </div>

        <div className="w-full mt-[25px] lg:mt-[20px]">
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
        <div className="w-full flex justify-end mt-[30px]">
          <div>
            <DropdownSizeMenu
              data={sizeList}
              selectedItem={size}
              setSelectedItem={item => {
                setSize(item)
              }}
            />
            <div className="flex items-center mt-[10px]">
              <div className={styles.sizeChart}>Select Size</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.borderLine} />
      <div className="w-full px-[16px] lg:px-[30px] mt-[20px]">
        <div className="w-full mt-[22px] mb-[25px]">
          {isLoading ? (
            <LoadingPrimaryButton fullWidth />
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

export default MerchClaimShipping
