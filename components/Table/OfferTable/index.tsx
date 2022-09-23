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

const OfferTable = props => {
  const { data } = props
  const viewport = useViewport()

  return (
    <table id="ActivityTable" className="w-full table-auto">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
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
            <td className="h-[90px] flex justify-center items-center">
              <Image
                src={item.avatar}
                alt=""
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                className="rounded-[15px]"
              />
            </td>
            <td>
              <div className="block">
                <div className="flex justify-center">{item.name01}</div>
                <div className="flex justify-center">{item.name02}</div>
              </div>
            </td>
            <td className="text-center">{item.offer}</td>
            <td className="text-center">{item.listing}</td>
            <td className="text-center">{item.time}</td>
            <td className="text-center">
              <div className="flex justify-center gap-[5px]">
                <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                {item.amount}
              </div>
            </td>
            <td className="text-center">
              {item.member.length > 11 ? item.member.slice(0, 5) + '...' + item.member.slice(-3) : item.member}
            </td>
            <td className="">
              <div className="w-full flex justify-center">
                {item.action === 'accept' && <GradientButton label="Accept" onClick={() => {}} height="48px" />}
                {item.action === 'cancel' && (
                  <OutlineButton
                    label="Cancel"
                    onClick={() => {}}
                    color="#DEEFD0"
                    borderColor="#DEEFD0"
                    height="48px"
                  />
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default OfferTable
