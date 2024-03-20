import React from 'react'

// next components
import 'react-placeholder/lib/reactPlaceholder.css'

// styles
import styles from './index.module.scss'

import { useRouter } from 'next/router'

import GradientButton from 'components/Button/GradientButton'

const ProvenanceTable = props => {
  const { data, nftUrl } = props
  const router = useRouter()

  return (
    <table id={'ArtworksTable'} className="w-full table-auto">
      <thead>
        <tr className={styles.tableHeader}>
          <th className="w-[25%] text-start">
            <div className="ml-3">Edition #</div>
          </th>
          <th className="w-[65%] text-start">Availability</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>
                <div className="h-[90px] flex justify-start items-center gap-[25px]">
                  <div className="ml-[10px]">
                    <div className="w-[50px] h-[50px] lg:w-[70px] lg:h-[70px]">
                      <img src={nftUrl} alt="" className="w-full h-full rounded-[15px] object-cover" />
                    </div>
                  </div>
                  <div className="block">
                    <div className={styles.nftName}>#{item.id}</div>
                  </div>
                </div>
              </td>

              <td className="text-start">{item.availability}</td>
              <td className="">
                <div className="w-full flex justify-center">
                  <GradientButton
                    label="Quick Buy"
                    onClick={() => router.push(`/order/${item.id}`)}
                    gradientDirection="right"
                    width="138px"
                    height="48px"
                  />
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ProvenanceTable
