import React, { useEffect, useState } from 'react'

// next images
import Head from 'next/head'

// solana
import { useWallet } from '@solana/wallet-adapter-react'
import { useMetaplex } from 'hooks/useMetaplex'
import { getMyNFTs } from 'utils/nfts.utils'
import { TURKEY_CIRCUS_COLLECTION_ID } from 'utils/dao'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'

// images and icons
import DaoPreviewImage from 'assets/images/dao-preview-image.png'

// styles
import { useViewport } from 'utils'
import DaoLandingDetail from 'components/pages/Dao/DaoLandingDetail'
import axios from 'axios'
import { useRouter } from 'next/router'
import { isExpiredDate } from 'utils/helpers'
import { getCurrentTurkeyNftCount } from 'utils/dao'
import { NftData } from 'types/nft'

const Dao = () => {
  const router = useRouter()

  const [proposal, setProposal] = useState(null)
  const { connected, publicKey } = useWallet()
  const { metaplex } = useMetaplex()
  const [nftIsLoaded, setNftIsLoaded] = useState(false)
  const [nfts, setNfts] = useState([])

  const { id } = router.query
  const paramId = id + ''
  const params = paramId.toString().split('proposal')
  const proposal_id = params.length > 1 ? parseInt(params[1]) : null

  useEffect(() => {
    ;(async () => {
      if (connected) {
        let nfts: any = await getMyNFTs(metaplex)
        setNftIsLoaded(true)
        setNfts(nfts)
      }
      getProposal()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaplex, connected])

  const [turkyNfts, setTurkeyNfts] = useState<NftData[] | null>(null)
  useEffect(() => {
    setTurkeyNfts(
      nfts.filter(({ collection }) => collection?.verified && TURKEY_CIRCUS_COLLECTION_ID.equals(collection.address))
    )
  }, [nfts])

  const getThreshold = async () => {
    return Math.trunc((await getCurrentTurkeyNftCount()) * 0.51)
  }

  const getProposal = async () => {
    if (proposal_id === null) {
      return
    }

    try {
      let vote = {
        proposal_id,
      }
      let response = await axios.post('/api/dao/proposal-detail', vote)
      if (response.data.success === true) {
        let proposals = response.data.proposals

        if (proposals.length > 0) {
          let new_element = {}
          let element = proposals[0]
          if (isExpiredDate(element.vote_start, element.vote_duration)) {
            let current_threshold = getThreshold()
            let vote_ratio = element.approved_votes / element.total_votes
            new_element = {
              ...element,
              status: 'closed',
              vote_result: vote_ratio >= 0.7 && element.total_votes >= current_threshold ? 'Passed' : 'Rejected',
            }
          } else if (isExpiredDate(element.vote_start, 0)) {
            new_element = { ...element, status: 'live' }
          } else {
            new_element = { ...element, status: 'pending' }
          }

          setProposal(new_element)
        }
      }
    } catch {}
  }

  const viewport = useViewport()

  let pageTitle = `CircusDAO | Foster Marketplace`
  let pageImageUrl = DaoPreviewImage.src
  let pageDescription = 'A community of artists and builders shaping the evolution of Foster Marketplace.'

  return (
    <div className="g-container">
      <Head>
        <title>{pageTitle}</title>

        <meta name="description" content={pageDescription} />

        <meta name="og:title" content={pageTitle} />
        <meta name="og:description" content={pageDescription} />
        <meta name="og:image" content={pageImageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImageUrl} />

        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="w-full relative flex justify-center">
        {proposal !== null && (
          <DaoLandingDetail
            publicKey={publicKey}
            proposal={proposal}
            turkyNfts={turkyNfts}
            threshold={getThreshold()}
            nftIsLoaded={nftIsLoaded}
            onBack={() => router.push('/dao')}
          />
        )}
      </div>
    </div>
  )
}

export default Dao

Dao.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
