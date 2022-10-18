import React, { useState } from 'react'

// components
import OfferTable from 'components/Table/OfferTable'
import OfferAccordion from 'components/Accordion/OfferAccordion'
import Pagination from 'components/Button/Pagination'

// custom functions
import { useViewport } from 'utils'

// json
import OfferList from 'assets/json/dashboard/offer-list.json'

const OfferSection = () => {
  const viewport = useViewport()

  const [offerList, setOfferList] = useState<any[]>([])

  const updateDataAction = (index, action) => {
    let newList = [...offerList]
    newList[index].action = action
    setOfferList(newList)
  }

  return (
    <section className="w-full mt-6 lg:mt-12 z-10">
      <div className="w-full mt-[15px] lg:mt-[34px]">
        {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
          <OfferTable data={offerList} updateDataAction={updateDataAction} />
        ) : (
          <OfferAccordion data={offerList} updateDataAction={updateDataAction} />
        )}
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={OfferList} getCurrentData={data => setOfferList(data)} />
      </div>
    </section>
  )
}

export default OfferSection
