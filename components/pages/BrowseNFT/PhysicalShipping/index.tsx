import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
// components
import { Country, State, City } from 'country-state-city'

// custom functions
import { useViewport } from 'utils'

// json

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'

// styles
import styles from './index.module.scss'
import SecondaryButton from 'components/Button/SecondaryButton'
import CountrySelect from 'components/Select/CountrySelect'
import GradientButton from 'components/Button/GradientButton'

// api

const PhysicalShipping = props => {
  const { onBack, onNext } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [enabled, setEnabled] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [apartment, setApartment] = useState('')
  const [country, setCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)

  const proceedToCheckout = () => {
    onNext()
  }

  return (
    <section className={styles.container}>
      <div className="flex gap-[15px] mt-[20px] items-center">
        <div className={styles.backBG} onClick={onBack}>
          <ArrowLeftIcon alt="" />
        </div>
        <div className={styles.selecteCategory}>Add Shipping Details</div>
      </div>
      <div className="w-full mt-[30px]">
        <div className={styles.label}>Email*</div>
        <input
          value={email}
          placeholder="Email"
          className={styles.inputArea}
          onChange={event => setEmail(event.target.value)}
        />
      </div>
      <div className="w-full mt-[30px]">
        <div className={styles.label}>Shipping Address *</div>
        <div className="mt-[10px] ">
          <CountrySelect
            data={Country.getAllCountries()}
            selected={country}
            onChange={item => setCountry(item)}
            maxHeight="none"
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
            value={apartment}
            placeholder="Apartment / Suite"
            className={styles.inputArea}
            onChange={event => setApartment(event.target.value)}
          />
        </div>
      </div>
      <div className="w-full mt-[50px] flex gap-[30px]">
        <GradientButton
          disabled={!enabled}
          label="Proceed to Checkout"
          fontSize={18}
          fullWidth
          height={53}
          onClick={() => proceedToCheckout()}
        />
      </div>
    </section>
  )
}

export default PhysicalShipping
