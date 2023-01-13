import { Metaplex, TokenGpaBuilder, UnparsedAccount } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { getListedNFTs, getMyListedNFTs } from './auction.util'
import nftsAPI from 'apis/nfts'

export async function getNFTOwner(mx: Metaplex, mintAddress: string) {
  /* @ts-ignore to get mintAddress*/
  const largestAccounts = await mx.connection.getTokenLargestAccounts(new PublicKey(mintAddress))
  const largestAccountInfo = await mx.connection.getParsedAccountInfo(largestAccounts.value[0].address)

  /* @ts-ignore to get Parsed Account Info*/
  return largestAccountInfo.value.data.parsed.info.owner
}

interface TokenAccount{
  address: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amount: bigint;
  delegate?: PublicKey;
  state: string;
  isNative?: bigint;
  delegatedAmount: bigint;
  closeAuthority?: PublicKey;
}

export function parseTokenAccount({ data, publicKey }: UnparsedAccount): TokenAccount{
  let offset = 0

  let mint = new PublicKey(data.slice(offset, offset += 32))
  let owner = new PublicKey(data.slice(offset, offset += 32))

  let amount = data.readBigUInt64LE(offset)
  offset += 8

  let delegate: PublicKey | null = null
  if(data.readUInt32LE(offset) === 1)
    delegate = new PublicKey(data.slice(offset + 4, offset + 4 + 32))
  offset += 4 + 32

  let state: string
  switch(data.readUInt8(offset)){
    case 1:
      state = "uninitialized"
      break
    case 2:
      state = "initialized"
      break
    case 3:
      state = "frozen"
      break
    default:
      throw new Error(`unrecognized token account state ${data.readUInt8(offset)}`)
  }
  offset += 1

  let isNative: bigint | null = null
  if(data.readUInt32LE(offset) === 1)
    isNative = data.readBigUInt64LE(offset + 4)
  offset += 4 + 8

  let delegatedAmount = data.readBigUInt64LE(offset)
  offset += 8

  let closeAuthority: PublicKey | null = null
  if(data.readUInt32LE(offset) === 1)
    closeAuthority = new PublicKey(data.slice(offset + 4, offset + 4 + 32))
  offset += 4 + 32

  return {
    address: publicKey,
    mint,
    owner,
    amount,
    delegate,
    state,
    isNative,
    delegatedAmount,
    closeAuthority
  }
}

export async function getMyNFTs(mx: Metaplex) {
  let tokenAccounts = await new TokenGpaBuilder(mx)
    .whereOwner(mx.identity().publicKey)
    .whereAmount(1)
    // .whereDoesntHaveDelegate()
    .getAndMap(parseTokenAccount)

  let nfts = await mx
    .nfts()
    .findAllByMintList({ mints: tokenAccounts.map(({ mint }) => mint) })

  let userNfts = [];
  for(let i = 0; i < tokenAccounts.length; i++){
    if(!nfts[i] || tokenAccounts[i].delegate)
      continue;

    userNfts.push(nfts[i]);
  }

  await Promise.all(
    userNfts.map(async (nft) => {
      nft.offchainMetadata = null
      try{
        nft.offchainMetadata = await fetch(nft.uri).then((r) => r.json())
      }
      catch(e){
        console.error(`failed to pull off chain metadata for ${nft.mint.address}: ${nft.uri}`)
        console.error(e)
      }
    })
  )

  return userNfts.filter(({ offchainMetadata }) => offchainMetadata)
}

export async function getMyCollectionNFTs(mx: Metaplex) {
  let nfts = await mx.nfts().findAllByOwner({ owner: mx.identity().publicKey })
  let identity = mx.identity().publicKey
  return nfts.filter(
    ({ updateAuthorityAddress, collectionDetails }) =>
      identity.equals(updateAuthorityAddress) &&
      collectionDetails?.version === 'V1'
  )
}

export async function getNFTDetailsByAddress(mx: Metaplex, id: string) {
  const res = await getListedNFTs(mx)
  const listedNFTs = (res === undefined ? [] : res).filter(nft => nft.asset.address.toString() === id)

  const owner = await getNFTOwner(mx, id)

  if (listedNFTs.length <= 0) {
    const nft = await mx
      .nfts()
      .findByMint({ mintAddress: new PublicKey(id) })

    return {
      asset: {
        ...nft,
        owner,
      },
    }
  }

  return {
    ...listedNFTs[0],
    asset: {
      ...listedNFTs[0].asset,
      owner,
    },
  }
}

export async function getGeneralNFTDetails(mx: Metaplex, id: string) {
  const nft = await mx
    .nfts()
    .findByMint({ mintAddress: new PublicKey(id) })
  const owner = await getNFTOwner(mx, id)
  return {
    asset: {
      ...nft,
      owner,
    },
  }
}

export async function getNFTByAddress(mx: Metaplex, mintAddress: PublicKey) {
  const nft = await mx.nfts().findByMint({ mintAddress })

  const owner = await getNFTOwner(mx, mintAddress.toString())

  return {
    owner,
    ...nft,
  }
}
