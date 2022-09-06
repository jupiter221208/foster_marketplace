import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'
import Image from 'next/image'

// third party components
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { limit } from 'utils/strings'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'

import Step01CollectionSection from 'components/pages/Create/Collection/Step01CollectionSection'
import Step02CollectionSection from 'components/pages/Create/Collection/Step02CollectionSection'
import Step03CollectionSection from 'components/pages/Create/Collection/Step03CollectionSection'
import SuccessMintSingleNFTSection from 'components/pages/Create/SingleNFT/SuccessMintSingleNFTSection'

import Chip from 'components/Chip'
import Stepper from 'components/Stepper'
import Select from 'components/Select'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'
import IconButton from 'components/Button/IconButton'
import CheckboxGroup from 'components/Checkbox/CheckboxGroup'
import Radio from 'components/Radio'
import CategoryListModal from 'components/Modal/CategoryListModal'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import EditorGrayIcon from 'assets/icons/editor-gray.svg'
import FullScreenGrayIcon from 'assets/icons/full-screen-gray.svg'
import TrashGrayIcon from 'assets/icons/trash-gray.svg'

// json
import NFTDimensionList from 'assets/json/nft-dimension-list.json'
import CategoryList from 'assets/json/category-list.json'

// styles
import styles from './index.module.scss'

const Step01SingleNFTSection = props => {
  const { viewport, selectedDimension, setSelectedDimension, setNftArt } = props

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-20`}>NFT Dimensions *</div>
      <div className="max-w-[370px] w-full mt-5">
        <Select data={NFTDimensionList} selected={selectedDimension} onChange={item => setSelectedDimension(item)} />
      </div>
      <div className={`${styles.subTitle} mt-10`}>Art *</div>
      <div className="mt-5">
        <Dropzone onDrop={acceptedFiles => setNftArt(acceptedFiles)} maxFiles={1}>
          {({ getRootProps, getInputProps }) => (
            <section className={styles.dropzone}>
              <div {...getRootProps()} className={styles.selectArea}>
                <input {...getInputProps()} />
                <p className={styles.subTitle}>Upload Here</p>
                <p className={styles.text}>Supported File Formats .png .jpeg .mp4 and .gif</p>
                <p className={styles.greenText}>Max File Size 30mb</p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    </div>
  ) : (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-20`}>NFT Dimensions *</div>
      <div className="max-w-[370px] w-full mt-5 pl-6">
        <Radio
          data={NFTDimensionList}
          selected={selectedDimension}
          onChange={item => setSelectedDimension(item)}
          direction="rtl"
        />
      </div>
      <div className={`${styles.subTitle} mt-10`}>Art *</div>
      <div className="mt-5">
        <Dropzone onDrop={acceptedFiles => setNftArt(acceptedFiles)} maxFiles={1}>
          {({ getRootProps, getInputProps }) => (
            <section className={styles.dropzone}>
              <div {...getRootProps()} className={styles.selectArea}>
                <input {...getInputProps()} />
                <p className={styles.subTitle}>Upload Here</p>
                <p className={styles.text}>
                  Supported File Formats
                  <br />
                  .png .jpeg .mp4 and .gif
                </p>
                <p className={styles.greenText}>Max File Size 30mb</p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    </div>
  )
}

export default Step01SingleNFTSection
