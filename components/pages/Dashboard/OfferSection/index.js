import React, { useState } from 'react'

// components
import OfferTable from 'components/Table/OfferTable'
import OfferAccordion from 'components/Accordion/OfferAccordion'
import Pagination from 'components/Button/Pagination'

// json
import OfferList from 'assets/json/dashboard/offer-list.json'

const OfferSection = props => {
  const { viewport } = props

  const [offerList, setOfferList] = useState([])

  return (
    <section className="w-full mt-6 lg:mt-12">
      <div className="w-full mt-[15px] lg:mt-[34px]">
        {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
          <OfferTable data={offerList} viewport={viewport} />
        ) : (
          <OfferAccordion data={offerList} viewport={viewport} />
        )}
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={OfferList} getCurrentData={data => setOfferList(data)} viewport={viewport} />
      </div>
    </section>
  )
}

export default OfferSection
