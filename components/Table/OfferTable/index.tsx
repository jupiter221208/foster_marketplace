import React from 'react'

// next components
import Image from 'next/image'

// components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'
import { getPriceValue, getShortAddress, timeSince } from 'utils/strings'

const OfferTable = props => {
  const { data, onCancel, onAccept } = props
  const viewport = useViewport()

  return (
    <table id="ActivityTable" className="w-full table-auto">
      <thead>
        <tr>
          <th>
            <div className="text-start pl-[35px]">Name</div>
          </th>
          <th>Offer</th>
          <th>Listing</th>
          <th>Time</th>
          <th>Amount</th>
          <th>Member</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td className="h-[90px] flex justify-start items-center gap-[25px]">
              <div className="ml-[10px]">
                <Image
                  src={item.asset.json.image}
                  alt=""
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                  className="rounded-[15px]"
                />
              </div>
              <div className="block">
                <div className="flex justify-center">{item.asset.json.name}</div>
                <div className="flex justify-center">{getShortAddress(item.asset.mint.address.toString())}</div>
              </div>
            </td>
            {item.isOutgoing ? 
              <td className="text-center">Outgoing</td> : 
              <td className="text-center">Incoming</td>
            }
            {item.isListed ? 
              <td className="text-center">Listed</td> :
              <td className="text-center">Unlisted</td>
            }
            <td className="text-center">{timeSince(item.createdAt.toNumber())}</td>
            <td className="text-center">
              <div className="flex justify-center gap-[5px]">
                <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                {getPriceValue(item.price.basisPoints.toNumber())}
              </div>
            </td>
            {item.isOutgoing ? 
              <td className="text-center">{getShortAddress(item.owner)}</td> : 
              <td className="text-center">{getShortAddress(item.buyer)}</td>
            }
            <td className="">
              <div className="w-full flex justify-center">
                {item.isOutgoing ?
                  <OutlineButton
                    label="Cancel"
                    onClick={() => onCancel(item.tradeStateAddress)}
                    color="#DEEFD0"
                    borderColor="#DEEFD0"
                    height="48px"
                  /> : 
                  <GradientButton 
                    label="Accept" 
                    onClick={() => onAccept(item.tradeStateAddress, item.listingTradeStateAddress)} height="48px" 
                  />
                }
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default OfferTable
