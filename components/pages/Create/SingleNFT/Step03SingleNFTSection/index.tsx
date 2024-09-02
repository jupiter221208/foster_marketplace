import React, { useEffect, useState } from 'react'

// components
import Input from 'components/Input'

// custom functions
import { useViewport } from 'utils'
import { validDigits } from 'utils/helpers'
import { getDisplayUserName } from 'utils/strings'
import { isValidPublicKey } from 'utils/wallet.util'

// styles
import styles from './index.module.scss'

// resources
import TrashIcon from 'assets/icons/trash-icon.svg?component'
import MaxNumberList from 'assets/json/single-nft/max-number-list.json'
import EditionList from 'assets/json/single-nft/edition-type.json'
import ProductionListMenu from 'components/ProductionListMenu'
import CategorySelectionMenu from 'components/Menu/CategorySelectionMenu'
import ArrowDownIcon from 'assets/icons/arrow-down-white.svg?component'
import CategoryListModal from 'components/Modal/CategoryListModal'
import CategoryList from 'assets/json/popular-category.json'
import Chip from 'components/Chip'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

const Step03SingleNFTSection = props => {
  const {
    type,
    setEditionType,
    setMaxSupply,
    royalties,
    setRoyalties,
    creatorList,
    setCreatorList,
    disabledNextButton,
    setDisabledNextButton,
    categoryList,
    handleSelectCategory,
    showCategoryList,
    setShowCategoryList,
    onNextStep,
    onBack,
  } = props
  const viewport = useViewport()
  const [edition, setEdition] = useState(EditionList[0])
  const [showAlert, setShowAlert] = useState(false)
  const [maxNum, setMaxNum] = useState(MaxNumberList[0])
  const [supply, setSupply] = useState(0)

  useEffect(() => {
    setDisabledNextButton(false)
    if (type !== 0) setEditionType(EditionList[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (creatorList.length === 0) return

    if (creatorList.length === 1 && creatorList[0].address === '' && disabledNextButton) {
      setDisabledNextButton(false)
      setShowAlert(false)
    }

    let totalShares = creatorList.reduce((total, { share }) => total + parseInt(share), 0)
    if (totalShares === 100) {
      if (disabledNextButton) setDisabledNextButton(false)
      setShowAlert(false)
    } else {
      setDisabledNextButton(true)
      setShowAlert(true)
    }

    let enabled = true
    for (let i = 0; i < creatorList.length; i++) {
      let creator = creatorList[i]
      if (creator.address.length === 0 || !isValidPublicKey(creator.address)) {
        enabled = false
        break
      }
    }
    if (enabled === false) setDisabledNextButton(true)
    else if (disabledNextButton) setDisabledNextButton(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatorList])

  const addAnotherCreator = () => {
    if (creatorList.length === 5) return

    let newList = []
    let count = creatorList.length
    let sharePros = Math.floor(100 / (count + 1)).toString()
    creatorList.map(creator => {
      creator.share = sharePros
      newList.push(creator)
    })
    newList.push({ address: '', share: sharePros, valid: true })
    setCreatorList(newList)
  }

  const removeCreator = index => {
    let list = [...creatorList]
    list.splice(index, 1)
    let count = list.length
    let sharePros = Math.floor(100 / count).toString()
    list.map(creator => {
      creator.share = sharePros
    })
    setCreatorList(list)
  }

  const setCreatorAddress = (index, value) => {
    let list = [...creatorList]
    list[index].address = value
    setCreatorList(list)
  }

  const setCreatorShare = (index, value) => {
    let list = [...creatorList]
    list[index].share = value
    setCreatorList(list)
  }

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className="w-full pr-[20px]">
      {type !== 0 && (
        <div className="mb-[30px]">
          <div className={styles.subTitle}>
            Edition type <span>*</span>
          </div>
          <div className="w-[60%] mt-[15px]">
            <ProductionListMenu
              label={edition['label']}
              data={EditionList}
              selectedItem={edition}
              setSelectedItem={data => {
                setEdition(data)
                setEditionType(data)
              }}
            />
          </div>

          {edition['id'] === 0 && (
            <div className="mt-[30px]">
              <div className={styles.maxSupplyTitle}>
                Max Supply <span>*</span>
              </div>
              <div className={styles.editionDescription}>The max number of copies that will be created</div>
              <div className="flex flex-wrap gap-[20px] mt-[16px] lg:mt-[25px]">
                {MaxNumberList.map((item, index) => (
                  <div
                    key={index}
                    className={`${maxNum.id === item.id ? styles.selectSupply : styles.noneSupply}`}
                    onClick={() => {
                      setMaxNum(item)
                      setMaxSupply(item.value)
                      setSupply(0)
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
              {maxNum['id'] === 3 && (
                <div className="max-w-[450px] mt-[45px]">
                  <div className={styles.maxTitle}>
                    Custom Supply <span>*</span>
                  </div>
                  <div className="mt-[15px]">
                    <Input
                      value={supply}
                      onChange={value => {
                        let digits = validDigits(value)
                        setMaxSupply(Math.floor(digits))
                        setSupply(Math.floor(digits))
                      }}
                      min={0}
                      placeholder="Provide of maxmium supply of editions"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className={`${styles.subTitle} mb-[15px]`}>Category (optional)</div>
      <CategorySelectionMenu categoryList={categoryList} handleSelectCategory={handleSelectCategory} />

      <div className={styles.collaborationTitle}>Creators</div>
      <div className={styles.collaborationText}>
        The creators fields are used to define who should receive royalties from secondary sales. By default the minter
        receives 100% of royalties.{' '}
      </div>

      <div className="max-w-[575px] max-h-[370px] w-full mt-[15px]">
        {creatorList.map(({ address, share }, index) => {
          return (
            <div key={index} className="w-full flex mb-[15px] gap-[15px] items-center">
              <div className="w-full max-w-[540px] flex gap-[18px]">
                <div className="w-full relative">
                  <input
                    className={styles.inputArea}
                    value={index === 0 ? `${getDisplayUserName(address)} (your address)` : address}
                    disabled={index === 0}
                    placeholder={'Enter wallet address'}
                    onChange={event => {
                      setCreatorAddress(index, event.target.value)
                    }}
                  />
                  {isValidPublicKey(address) ? null : (
                    <div className={styles.addressErrorText}>Please provide a valid Solana address</div>
                  )}
                </div>
                {creatorList.length > 0 && (
                  <div className="flex gap-[4px] items-center mt-[-5px]">
                    <input
                      className={styles.inputPros}
                      value={share}
                      placeholder={'100'}
                      onChange={event => {
                        let pros = validDigits(event.target.value)
                        if (pros === '') {
                          setCreatorShare(index, '')
                        } else {
                          setCreatorShare(index, event.target.value)
                        }
                      }}
                    />
                    <div className={styles.percent}>%</div>
                  </div>
                )}
              </div>
              <div className="w-[20px]">{index > 0 && <TrashIcon onClick={() => removeCreator(index)} />}</div>
            </div>
          )
        })}
      </div>
      {showAlert && <div className={styles.prosErrorText}>Total Percentage should be 100%</div>}

      <div className={styles.button} onClick={() => addAnotherCreator()}>
        Add Creator
      </div>

      <div className={`${styles.subTitle} mt-[30px]`}>
        Royalties <span>*</span>
      </div>
      <div className="max-w-[370px] w-full mt-[15px]">
        <Input
          value={royalties}
          placeholder="Insert a royalty percentage"
          label01="From 0 to 10%"
          min={0}
          onChange={value => {
            let royal = validDigits(value)
            if (royal > 10) setRoyalties(10)
            else setRoyalties(Math.floor(royal))
          }}
        />
      </div>
      <div className="w-full flex justify-end mt-[20px]">
        <div className="flex gap-10"></div>
      </div>
    </div>
  ) : (
    <div className="w-full">
      {type !== 0 && (
        <div className="mt-[20px]">
          <div className={styles.subTitle}>
            Edition type <span>*</span>
          </div>
          <div className="w-full mt-[15px]">
            <ProductionListMenu
              width={343}
              label={edition['label']}
              data={EditionList}
              selectedItem={edition}
              setSelectedItem={data => {
                setEdition(data)
                setEditionType(data)
              }}
            />
          </div>
          {edition['id'] === 0 && (
            <div className="mt-[30px]">
              <div className={styles.maxSupplyTitle}>
                Max Supply <span>*</span>
              </div>
              <div className={styles.editionDescription}>The max number of copies that will be created</div>
              <div className="flex flex-wrap gap-[20px] mt-[16px] lg:mt-[25px]">
                {MaxNumberList.map((item, index) => (
                  <div
                    key={index}
                    className={`${maxNum.id === item.id ? styles.mobileSelectSupply : styles.mobileNoneSupply} ${
                      item.id === 3 ? 'w-[120px]' : 'w-[50px]'
                    }`}
                    onClick={() => {
                      setMaxNum(item)
                      setMaxSupply(item.value)
                      setSupply(0)
                    }}
                  >
                    {item.id === 3 ? item.label : item.value}
                  </div>
                ))}
              </div>

              {maxNum['id'] === 3 && (
                <div className="max-w-[450px] mt-[30px]">
                  <div className={styles.maxTitle}>
                    Custom Supply <span>*</span>
                  </div>
                  <div className="mt-[15px]">
                    <Input
                      value={supply}
                      onChange={value => {
                        let digits = validDigits(value)
                        setMaxSupply(Math.floor(digits))
                        setSupply(Math.floor(digits))
                      }}
                      min={0}
                      placeholder="Provide of maxmium supply of editions"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="w-full mt-[30px]">
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <div className={styles.chooseCategory}>Category (optional)</div>
            <div className={styles.categoryBtn} onClick={() => setShowCategoryList(true)}>
              <>Select up to three categories</>
              <ArrowDownIcon />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-wrap justify-start items-center mt-[9px] gap-[10px]">
          {categoryList?.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
        </div>
        {showCategoryList && (
          <CategoryListModal
            data={CategoryList}
            categoryList={categoryList}
            onChange={index => handleSelectCategory(index)}
            onClick={() => setShowCategoryList(!showCategoryList)}
            onClickCancel={() => setShowCategoryList(false)}
          />
        )}
      </div>

      <div className={styles.collaborationTitle}>Creators</div>
      <div className={styles.collaborationText}>
        The creators fields are used to define who should receive royalties from secondary sales. By default the minter
        receives 100% of royalties.{' '}
      </div>
      <div className="max-w-[540px] max-h-[350px] w-full mt-[18px]">
        {creatorList.map(({ address, share }, index) => {
          return (
            <div key={index} className="flex gap-[10px] mb-[20px] items-center">
              <div className="w-full relative">
                <input
                  className={styles.inputArea}
                  value={index === 0 ? `${getDisplayUserName(address)} (your address)` : address}
                  placeholder={'Enter wallet address'}
                  disabled={index === 0}
                  onChange={event => {
                    setCreatorAddress(index, event.target.value)
                  }}
                />
                {isValidPublicKey(address) ? null : (
                  <div className={styles.addressErrorText}>Please provide a valid Solana address</div>
                )}
              </div>
              {creatorList.length > 1 && (
                <input
                  className={styles.inputPros}
                  value={share}
                  placeholder={'100'}
                  onChange={event => {
                    let share = validDigits(event.target.value)
                    if (share === '') {
                      setCreatorShare(index, '')
                    } else {
                      setCreatorShare(index, event.target.value)
                    }
                  }}
                />
              )}
              {creatorList.length > 1 && (
                <div className="w-[24px]">{index > 0 && <TrashIcon onClick={() => removeCreator(index)} />}</div>
              )}
            </div>
          )
        })}
      </div>
      {showAlert && <div className={styles.prosErrorText}>Total Percentage should be 100%</div>}
      <div className={styles.button} onClick={() => addAnotherCreator()}>
        Add Creator
      </div>

      <div className={`${styles.subTitle} mt-[30px]`}>
        Royalties <span>*</span>
      </div>
      <div className="max-w-[370px] w-full mt-[15px]">
        <Input
          value={royalties}
          placeholder="Insert a royalty percentage"
          label01="From 0 to 10%"
          color={'var(--text-gray-200-color)'}
          min={0}
          onChange={value => {
            let royal = validDigits(value)
            if (royal > 10) setRoyalties(10)
            else setRoyalties(Math.floor(royal))
          }}
        />
      </div>

      <div className="w-full flex flex-wrap gap-[18px] mt-[30px]">
        <OutlineButton fullWidth label="Back" onClick={() => onBack()} />
        <GradientButton fullWidth label="Next" onClick={() => onNextStep()} disabled={disabledNextButton} />
      </div>
    </div>
  )
}

export default Step03SingleNFTSection
