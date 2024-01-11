import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// components

// json

// resources
import TrashIcon from 'assets/icons/trash-icon.svg?component'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// apis

const EASection = props => {
  const { onBack } = props

  const [artworkList, setArtworkList] = useState([])
  const [tokenList, setTokenList] = useState([])

  useEffect(() => {
    const artworks = [
      {
        nft_name: 'Anubis',
        mint_address: 'RrkQW86rKadkzcG3Z93pVQ1pBNkzxBsXSFAThH5QoTH',
        nft_asset: 'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/bf9e9a2f-b657-4c0c-95a2-1b1d5fdc14a5.jpg',
      },
      {
        nft_name: 'Anubis',
        mint_address: 'RrkQW86rKadkzcG3Z93pVQ1pBNkzxBsXSFAThH5QoTH',
        nft_asset: 'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/bf9e9a2f-b657-4c0c-95a2-1b1d5fdc14a5.jpg',
      },
      {
        nft_name: 'Anubis',
        mint_address: 'RrkQW86rKadkzcG3Z93pVQ1pBNkzxBsXSFAThH5QoTH',
        nft_asset: 'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/bf9e9a2f-b657-4c0c-95a2-1b1d5fdc14a5.jpg',
      },
      {
        nft_name: 'Anubis',
        mint_address: 'RrkQW86rKadkzcG3Z93pVQ1pBNkzxBsXSFAThH5QoTH',
        nft_asset: 'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/bf9e9a2f-b657-4c0c-95a2-1b1d5fdc14a5.jpg',
      },
      {
        nft_name: 'Anubis',
        mint_address: 'RrkQW86rKadkzcG3Z93pVQ1pBNkzxBsXSFAThH5QoTH',
        nft_asset: 'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/bf9e9a2f-b657-4c0c-95a2-1b1d5fdc14a5.jpg',
      },
      {
        nft_name: 'Anubis',
        mint_address: 'RrkQW86rKadkzcG3Z93pVQ1pBNkzxBsXSFAThH5QoTH',
        nft_asset: 'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/bf9e9a2f-b657-4c0c-95a2-1b1d5fdc14a5.jpg',
      },
    ]
    setArtworkList(artworks)
    setTokenList([
      '96RqhnjPdYVFSrLX12zBpyQvRfPcXt1z7hnWUe61SXPB',
      '96RqhnjPdYVFSrLX12zBpyQvRfPcXt1z7hnWUe61SXPB',
      '96RqhnjPdYVFSrLX12zBpyQvRfPcXt1z7hnWUe61SXPB',
    ])
  }, [])

  const removeNft = index => {
    if (artworkList.length === 1) return
    let list = [...artworkList]
    list.splice(index, 1)
    setArtworkList(list)
  }

  const onImport = () => {}

  return (
    <div className="g-container">
      <div className={styles.container}>
        <div className={styles.title}>Import Preview</div>
        <div className="w-full flex mt-[40px] mb-[40px] ml-[22px] mr-[22px]">
          <div className="w-[56%] px-[22px]">
            <div className={styles.artworkArea}>
              <div className={styles.artworkTitle}>4 artworks</div>
              <div className="mt-[30px] h-[440px] overflow-scroll">
                {artworkList.map((item, index) => {
                  return (
                    <div key={index} className="w-full flex mb-[20px] items-center">
                      <div className="min-w-[16px]">
                        <TrashIcon onClick={() => removeNft(index)} />
                      </div>

                      <div className={styles.nftAsset}>
                        <Image
                          src={item.nft_asset}
                          width={88}
                          height={88}
                          alt=""
                          layout="responsive"
                          objectFit="cover"
                        />
                      </div>
                      <div className="w-full ml-4 mr-4">
                        <div className={styles.nftName}>{item.nft_name}</div>
                        <div className={styles.mintAddress}>{item.mint_address}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="w-full flex justify-end mt-[40px]">
                <div className="flex justify-around gap-[10px] lg:gap-[25px]">
                  <OutlineButton
                    width={120}
                    height={50}
                    label="Back"
                    color="#eff0f6"
                    borderColor="rgba(239, 240, 247, 0.25)"
                    onClick={() => onBack}
                  />
                  <GradientButton
                    width={120}
                    height={50}
                    label="Import"
                    backgroundColor01="#95DBD5"
                    backgroundColor02="#95DBD5"
                    color="#202427"
                    onClick={() => onImport()}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-[44%] px-[44px]">
            <div className={styles.tokenArea}>
              <div className={styles.tokenTitle}>No results found for the following tokens:</div>
              <div className="mt-[30px]">
                {tokenList.map((item, index) => {
                  return (
                    <div key={index} className={styles.tokenText}>
                      {item}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EASection
