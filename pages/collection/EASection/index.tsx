import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'
import Image from 'next/image'

// components

// solana
import { PublicKey } from '@solana/web3.js'
import { type Metadata } from '@metaplex-foundation/js'

// resources
import TrashIcon from 'assets/icons/trash-icon.svg?component'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// apis
import { useMetaplex } from 'hooks/useMetaplex'
import LoadingButton from 'components/Button/LoadingButton'
import nftAPI from 'apis/nfts'

export interface EASectionProps {
  mintList: string[]
  coverUrl: string
  setMintList: (list: string[]) => void
  onBack: () => any
  onSuccess: () => any
}

const EASection = ({ mintList, coverUrl, setMintList, onBack, onSuccess }: EASectionProps) => {
  const { query } = useRouter()
  const { metaplex } = useMetaplex()
  const [isProcessing, setIsProcessing] = useState(false)

  const collectionMint = new PublicKey(query.address ?? 0)

  // TODO: replace with DAS endpoints once merged
  const [nftDetails, setNftDetails] = useState<any>([])
  const [errorList, setErrorList] = useState<string[][]>([])

  useEffect(() => {
    ;(async () => {
      let { result } = await fetch(metaplex.connection.rpcEndpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'getMultipleNftsDAS',
          method: 'getAssetBatch',
          params: {
            ids: mintList,
            options: {
              showUnverifiedCollections: true,
            },
          },
        }),
      }).then(r => r.json())

      let validNfts = []
      let errors: string[][] = []
      for (let i = 0; i < mintList.length; i++) {
        let nft = result[i]
        if (!nft) {
          errors.push([mintList[i], 'could not load nft'])
          continue
        }

        let error: null | string = null

        let collection = nft.grouping.find(({ group_key }) => group_key == 'collection')
        if (collection?.verified && collection?.group_value == collectionMint.toString())
          error = `nft is already verified part of collection ${query.address}`
        else if (!nft.mutable) error = 'nft is immutable, cannot be updated'
        else {
          let updateAuthority = nft.authorities?.find(({ scopes }) => scopes.includes('full'))?.address
          if (!updateAuthority) error = 'could not find update authority of nft'
          else if (updateAuthority != metaplex.identity().publicKey.toString())
            error = `update authority mismatch, expected ${updateAuthority}, got ${metaplex.identity().publicKey}`
        }

        if (error) errors.push([nft.id, error])
        else validNfts.push(nft)
      }

      setNftDetails(validNfts)
      setErrorList(errors)
    })()
  }, [metaplex, mintList])

  const removeNft = index => {
    if (nftDetails.length === 1) return
    let list = [...nftDetails]
    list.splice(index, 1)
    setNftDetails(list)
  }

  const onImport = async () => {
    setIsProcessing(true)
    let mints = nftDetails.map(({ id }) => new PublicKey(id))
    let nftInfos = (await metaplex.nfts().findAllByMintList({ mints })) as Metadata[]

    let builders = nftInfos
      .filter(nft => nft?.isMutable)
      .map(nft =>
        metaplex
          .nfts()
          .builders()
          .update({
            nftOrSft: {
              ...nft,
              address: nft.mintAddress,
            },
            collection: collectionMint,
          })
          .add(
            metaplex.nfts().builders().verifyCollection({
              mintAddress: nft.mintAddress,
              collectionMintAddress: collectionMint,
            })
          )
      )
    let batchedBuilders = []
    for (let i = 0; i < builders.length; i++)
      if (i % 3 == 0) batchedBuilders[i / 3] = builders[i]
      else batchedBuilders[Math.floor(i / 3)].add(builders[i])

    let blockhashInfo = await metaplex.connection.getLatestBlockhash()
    let txs = batchedBuilders.map(builder => builder.toTransaction(blockhashInfo))
    let signedTxs = await metaplex.identity().signAllTransactions(txs)
    let signatures = await Promise.all(signedTxs.map(tx => metaplex.connection.sendRawTransaction(tx.serialize())))
    console.log(signatures)

    await Promise.all(
      signatures.map(signature => metaplex.rpc().confirmTransaction(signature, blockhashInfo, 'finalized'))
    )

    await nftAPI.batchIndex(nftInfos.filter(nft => nft?.isMutable).map(({ mintAddress }) => mintAddress.toString()))

    onSuccess()
    // TODO: show success message
    //
    setIsProcessing(false)
  }

  return (
    <div className="g-container">
      <div className={styles.container}>
        <div className={styles.title}>Import Preview</div>
        <div className="w-full lg:block hidden">
          <div className="w-full flex mt-[40px] mb-[40px] ml-[22px] mr-[22px]">
            <div className="w-[56%] px-[22px]">
              <div className={styles.artworkArea}>
                <div className={styles.artworkTitle}>{nftDetails.length} artworks</div>
                <div className="mt-[30px] h-[440px] overflow-scroll">
                  {nftDetails.map((nft, index) => {
                    return (
                      <div key={index} className="w-full flex mb-[20px] items-center">
                        <div className="min-w-[16px]">
                          <TrashIcon onClick={() => removeNft(index)} />
                        </div>

                        <div className={styles.nftAsset}>
                          <Image
                            src={nft.content.files?.[0]?.cdn_uri ?? nft.content.links.image}
                            width={88}
                            height={88}
                            alt=""
                            layout="responsive"
                            objectFit="cover"
                          />
                        </div>
                        <div className="w-full ml-4 mr-4">
                          <div className={styles.nftName}>{nft.content.metadata.name}</div>
                          <div className={styles.mintAddress}>{nft.id}</div>
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
                      color="var(--text-gray-200-color)"
                      borderColor="rgba(var(--main-bg-color-rgb), 0.25)"
                      onClick={() => onBack()}
                    />
                    {isProcessing ? (
                      <LoadingButton backgroundColor01="#95DBD5" backgroundColor02="#95DBD5" width={120} height={50} />
                    ) : (
                      <GradientButton
                        width={120}
                        height={50}
                        label="Import"
                        onClick={() => onImport()}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[44%] px-[44px]">
              <div className={styles.tokenArea}>
                <div className={styles.tokenTitle}>Could not process the following tokens:</div>
                <div className="mt-[30px]">
                  {errorList.map(([nftId, reason], index) => {
                    return (
                      <div key={index} className={styles.tokenText}>
                        {`${nftId}: ${reason}`}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:hidden block">
          <div className="mt-[30px]">
            {nftDetails.map((nft, index) => {
              return (
                <div key={index} className="mb-[20px]">
                  <div className="w-full flex items-center">
                    <div className="min-w-[16px]">
                      <TrashIcon onClick={() => removeNft(index)} />
                    </div>

                    <div className={styles.nftAsset}>
                      <Image
                        src={nft.content.files?.[0]?.cdn_uri ?? nft.content.links.image}
                        width={68}
                        height={68}
                        alt=""
                        layout="responsive"
                        objectFit="cover"
                      />
                    </div>
                    <div className="w-full ml-4 mr-4">
                      <div className={styles.nftName}>{nft.content.metadata.name}</div>
                    </div>
                  </div>
                  <div className={styles.mintAddress}>{nft.id}</div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-around gap-[20px] mt-[50px]">
            <OutlineButton
              fullWidth
              height={45}
              label="Back"
              color="#eff0f6"
              borderColor="rgba(239, 240, 247, 0.25)"
              onClick={() => onBack()}
            />
            {isProcessing ? (
              <LoadingButton backgroundColor01="#95DBD5" backgroundColor02="#95DBD5" fullWidth height={45} />
            ) : (
              <GradientButton
                fullWidth
                height={45}
                label="Import"
                onClick={() => onImport()}
              />
            )}
          </div>
          <div className="w-full mt-[50px]">
            <div className={styles.tokenTitle}>Could not process the following tokens:</div>
            <div className="mt-[10px]">
              {errorList.map(([nftId, reason], index) => {
                return (
                  <div key={index} className={styles.tokenText}>
                    {`${nftId}: ${reason}`}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EASection
