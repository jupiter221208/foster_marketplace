import React from 'react'

// third party components
import Dropzone from 'react-dropzone'

// components
import Select from 'components/Select'
import Radio from 'components/Radio'

// json
import NFTDimensionList from 'assets/json/nft-dimension-list.json'

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
                <p className={styles.text}>Supported File Formats .png .jpeg .mp4 .mp3 and .gif</p>
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
