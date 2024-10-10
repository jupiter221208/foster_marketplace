import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
// next component

// components
import { Country, State } from 'country-state-city'
import CountrySelect from 'components/Select/CountrySelect'
import Alert from 'components/Alert'
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'
import LoadingButton from 'components/Button/LoadingButton'
import SizeChartModal from 'components/Modal/SizeChartModal'

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
import storeAPI from 'apis/store'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

const MerchClaimShipping = props => {
  const dispatch = useDispatch()
  const { data, mintAddress, onClose, onNext, productId, setMerchSize, merchList, rawList } = props
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

  const [alertData, setAlertData] = useState([
    {
      id: 0,
      title: 'Shipping Method Failure',
      description: `You didn't find shipping method!`,
      type: 'failure',
    },
  ])

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
        if (response?.shippingMethods?.length > 0) {
          let code = ''
          if (country.isoCode === 'US') code = 'usps_priority_mail'
          else {
            let services = response?.shippingMethods.filter(item => item.serviceCode === 'gp_plus')
            if (services.length > 0) code = 'gp_plus'
            else code = 'international'
          }
          onCheckout(code)
        } else setIsLoading(false)
      },
      error => {
        setIsLoading(false)
        setShowAlert(true)
      }
    )
  }

  const onCheckout = serviceCode => {
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

    const { id, name: productName, description, color, quantity, size, technique } = data

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
        type: 'foster',
        nftName: productName,
        fosterUrl: window.location.href,
        mockupUrl: mockupUrls.join(','),
        assetUrl: rawUrls.join(','),
        nftAddress: mintAddress,
        apparel: description,
        size: size,
        color: color,
        technique: technique,
        printEditionAddress: mintAddress,
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

  const onAddCart = () => {
    let existingData = JSON.parse(localStorage.getItem('cart_v2')) || []
    if (!Array.isArray(existingData)) {
      existingData = []
    }
    const { id } = data

    let cart_data = {
      version: 'v2',
      type: 'foster',
      merchEdition: true,
      cost: 0,
      productId: id,
      data,
      fosterUrl: window.location.href,
      merchList,
      rawList,
      nftAddress: mintAddress,
      printEditionAddress: mintAddress,
    }

    existingData.push(cart_data)
    localStorage.setItem('cart_v2', JSON.stringify(existingData))

    dispatch({ type: 'set', cartUpdated: true })

    setAlertData([
      {
        id: 0,
        title: 'Item Added to Your Cart!',
        description: `${data.name} is ready and waiting in your cart. Feel free to browse for more goodies or head to checkout whenever you're ready.`,
        type: 'success',
      },
    ])
    setShowAlert(true)
    setTimeout(() => {
      onClose()
    }, 2000)
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
        </div>
      </div>
      <div className={styles.borderLine} />
      <div className="w-full px-[16px] lg:px-[30px] mt-[20px] flex justify-between gap-[15px]">
        <div>
          <OutlineButton
            width={264}
            height={45}
            borderRadius={23}
            label="Add to Cart"
            backgroundColor="var(--bg-new-color)"
            onClick={() => onAddCart()}
          />
        </div>
        <div className="w-full mb-[25px]">
          {isLoading ? (
            <LoadingButton borderRadius={23} height={45} fullWidth />
          ) : (
            <GradientButton
              borderRadius={23}
              height={45}
              label="Checkout"
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
