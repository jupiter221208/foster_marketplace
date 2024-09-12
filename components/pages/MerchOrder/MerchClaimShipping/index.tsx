import React, { useState, useEffect } from 'react'

// next component

// components
import { Country, State } from 'country-state-city'
import PrimaryButton from 'components/Button/PrimaryButton'
import CountrySelect from 'components/Select/CountrySelect'
import Alert from 'components/Alert'
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'

// custom functions
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// images
import CloseIcon from 'assets/icons/close-wallet.svg?component'

// json
import SizeList from 'assets/json/print/size-chat-modal.json'

// styles
import styles from './index.module.scss'

// api
import merchAPI from 'apis/merch'
import LoadingButton from 'components/Button/LoadingButton'
import SizeChartModal from 'components/Modal/SizeChartModal'

const MerchClaimShipping = props => {
  const { onClose, onNext, productId, setMerchSize } = props
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
  const [sizeList, setSizeList] = useState([])
  const [tableModal, setTableModal] = useState(false)

  const alertData = [
    {
      id: 0,
      title: 'Shipping Method Failure',
      description: `You didn't find shipping method!`,
      type: 'failure',
    },
  ]

  const getApparelName = () => {
    let type = 'Unisex'
    let name = 'Hoodie'

    if (productId === 1 || productId === 2) {
      name = 'Hoodie'
    } else if (productId === 3 || productId === 4) {
      name = 'Long Sleeve'
    } else if (productId === 5 || productId === 6) {
      name = 'Short Sleeve'
    } else if (productId === 7 || productId === 8) {
      name = 'Sweatshirt'
    } else if (productId === 9 || productId === 10) {
      name = "Women's Short Sleeve"
    }

    let list = ShopApparelList.filter(item => item.base === name && item.sub_type == type)
    if (list.length > 0) return list[0].name
    else return name
  }

  const getApparelLabel = () => {
    let type = 'Unisex'
    let name = 'Hoodie'

    if (productId === 1 || productId === 2) {
      name = 'Hoodie'
    } else if (productId === 3 || productId === 4) {
      name = 'Long Sleeve'
    } else if (productId === 5 || productId === 6) {
      name = 'Short Sleeve'
    } else if (productId === 7 || productId === 8) {
      name = 'Sweatshirt'
    } else if (productId === 9 || productId === 10) {
      name = "Women's Short Sleeve"
    }

    let list = ShopApparelList.filter(item => item.base === name && item.sub_type == type)
    if (list.length > 0) return list[0].label
    else return name
  }

  const onClickSize = index => {
    let newSize = []
    sizeList.map(item => {
      if (item.id === index) {
        newSize.push({ ...item, selected: true })
        setMerchSize(item.name)
      } else {
        newSize.push({ ...item, selected: false })
      }
    })
    setSizeList(newSize)
  }

  useEffect(() => {
    if (productId) {
      let size_list
      switch (productId) {
        case 1:
        case 2:
          size_list = SizeList[2].size
          break
        case 3:
        case 4:
          size_list = SizeList[3].size
          break
        case 5:
        case 6:
          size_list = SizeList[0].size
          break
        case 7:
        case 8:
          size_list = SizeList[1].size
          break
        case 9:
        case 10:
          size_list = SizeList[4].size
          break
        default:
          size_list = SizeList[5].size
          break
      }
      let sizes = []
      size_list.map((size, index) => {
        if (index === Math.round(size_list.length / 2)) {
          sizes.push({ id: index, name: size.Size, selected: true })
          setMerchSize(size.Size)
        } else {
          sizes.push({ id: index, name: size.Size, selected: false })
        }
      })
      setSizeList(sizes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

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
        <div className="w-full mt-[30px]">
          <div className="mt-[15px]">
            <div className="w-full flex justify-between items-center">
              <div className={styles.sizeChart}>Select Size</div>
              <div className={styles.sizeChart} onClick={() => setTableModal(true)}>
                Size Chart »
              </div>
            </div>
            <div className="mt-[15px]">
              <div className="w-full flex flex-wrap gap-[9px]">
                {sizeList.map((item, index) => (
                  <div
                    key={index}
                    className={item.selected ? styles.selectedSize : styles.unselectedSize}
                    onClick={() => onClickSize(index)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* <div>
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
          </div> */}
        </div>
      </div>
      <div className={styles.borderLine} />
      <div className="w-full px-[16px] lg:px-[30px] mt-[20px]">
        <div className="w-full mt-[22px] mb-[25px]">
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
      </div>
      <SizeChartModal
        open={tableModal}
        title={getApparelName()}
        label={getApparelLabel()}
        onClose={() => setTableModal(false)}
      />
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
