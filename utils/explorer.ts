import { PublicKey } from '@solana/web3.js'

export function getExplorerUrl(
  endpoint: string,
  viewTypeOrItemAddress: 'inspector' | PublicKey | string,
  itemType = 'address' // | 'tx' | 'block'
) {
  const getClusterUrlParam = () => {
    let cluster = ''
    
    if (endpoint === 'https://api.devnet.solana.com') {
      cluster = 'devnet-qn1'
    } else {
      cluster = 'mainnet-qn1'
    }

    return cluster ? `?cluster=${cluster}` : ''
  }

  return `https://solana.fm/${itemType}/${viewTypeOrItemAddress}${getClusterUrlParam()}`
}
