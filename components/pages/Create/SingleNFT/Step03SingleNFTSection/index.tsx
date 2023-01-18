import React, { useState } from 'react'

// next components
import Image from 'next/image'

// components
import Input from 'components/Input'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// resources
import SelectCollectionMenu from 'components/Menu/SelectCollectionMenu'

const Step03SingleNFTSection = props => {
  const { royalties, setRoyalties, disabledNextButton, createNft } = props
  const [collections, setCollections] = useState([
    { id: 0, name: 'NFT Collection Name1' },
    { id: 1, name: 'NFT Collection Name2' },
    { id: 1, name: 'NFT Collection Name3' },
    { id: 1, name: 'NFT Collection Name4' },
  ])
  const viewport = useViewport()

  const chooseCollection = index => {}

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-20`}>Royalties *</div>
      <div className="max-w-[370px] w-full mt-5">
        <Input
          value={royalties}
          placeholder="Insert a royalty percentage"
          label="From 0 to 10%"
          type="number"
          onChange={value => setRoyalties(value)}
        />
      </div>
      <div className="w-full mt-[54px]">
        <div className={styles.subTitle}>Add to an existing collection (optional)</div>
        <SelectCollectionMenu collections={collections} onClick={index => chooseCollection(index)} />
      </div>
      <div className="w-full mt-16">
        {royalties === '' || parseInt(royalties) < 0 || parseInt(royalties) > 10 ? (
          <Button
            width={viewport === '2xl' ? 124 : 117}
            height={viewport === '2xl' ? 53 : 46}
            label="Mint NFT"
            disabled={disabledNextButton}
            backgroundColor="#888A8E"
          />
        ) : (
          <GradientButton width={viewport === '2xl' ? 124 : 117} label="Mint NFT" onClick={() => createNft()} />
        )}
      </div>
    </div>
  ) : (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-5`}>Royalties *</div>
      <div className="max-w-[370px] w-full mt-4">
        <Input
          value={royalties}
          placeholder="Insert a royalty percentage"
          label="From 0 to 10%"
          type="number"
          onChange={value => setRoyalties(value)}
        />
      </div>
      <div className="w-full mt-[54px]">
        <div className={styles.subTitle}>Add to an existing collection (optional)</div>
        <SelectCollectionMenu collections={collections} onClick={index => chooseCollection(index)} />
      </div>
      <div className="w-full mt-10">
        {royalties === '' || parseInt(royalties) < 0 || parseInt(royalties) > 10 ? (
          <Button label="Mint NFT" fullWidth disabled={disabledNextButton} backgroundColor="#888A8E" />
        ) : (
          <GradientButton label="Mint NFT" onClick={() => createNft()} fullWidth />
        )}
      </div>
    </div>
  )
}

export default Step03SingleNFTSection
