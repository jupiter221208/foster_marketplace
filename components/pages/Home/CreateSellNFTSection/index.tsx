import React, { useState } from 'react'

// third party components
import { useSelector } from 'react-redux'

// components
import CreateSellNFTCard from 'components/Card/CreateSellNFTCard'

// json
import CreateSellNFTList from 'assets/json/create-sell-nft.json'

// styles
import styles from './index.module.scss'

const CreateSellNFTSection = () => {
  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] grid grid-cols-12 gap-0 gap-y-4 md:gap-10 z-10">
        {CreateSellNFTList.map((item, index) => (
          <div className="col-span-12 lg:col-span-4" key={index}>
            <CreateSellNFTCard
              title={item.title}
              description={item.description}
              linkText={item.linkText}
              link={item.link}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default CreateSellNFTSection
