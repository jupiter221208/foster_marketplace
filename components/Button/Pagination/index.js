import React, { useEffect, useState } from 'react'

// custom components
import IconButton from 'components/Button/IconButton'
import Accordion from 'components/Accordion'

// images and icons
import ArrowLeftIcon from 'assets/icons/arrow-left-white.svg'
import ArrowRightIcon from 'assets/icons/arrow-right-white.svg'

// json
import RowCountList from 'assets/json/dashboard/row-count-list.json'

// styles
import styles from './index.module.scss'

const Pagination = props => {
  const { data, getCurrentData, viewport } = props

  const [rowCount, setRowCount] = useState(12)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentData, setCurrentData] = useState([])

  useEffect(() => {
    setTotalCount(data.length)
    setCurrentPage(0)
    setCurrentData(data.slice(0, rowCount))
  }, [data, rowCount])

  useEffect(() => {
    getCurrentData(currentData)
  }, [getCurrentData, currentData])

  const handlePrev = () => {
    if (currentPage - 1 >= 0) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage + 1 < Math.ceil(data.length / rowCount)) setCurrentPage(currentPage + 1)
  }

  useEffect(() => {
    setCurrentData(data.slice(currentPage * rowCount, currentPage * rowCount + rowCount))
  }, [data, currentPage, rowCount])

  return (
    <div className={styles.container}>
      <div>Rows per page:</div>
      <div className="relative">
        <Accordion label={rowCount.toString()} data={RowCountList} onClick={item => setRowCount(item.value)} />
      </div>
      <div>
        {currentPage * rowCount + 1} -{' '}
        {currentPage * rowCount + rowCount > totalCount ? totalCount : currentPage * rowCount + rowCount} of{' '}
        {totalCount}
      </div>
      <div>
        <IconButton
          width={viewport === 'xs' || viewport === 'sm' ? '30px' : '46px'}
          height={viewport === 'xs' || viewport === 'sm' ? '30px' : '46px'}
          icon={ArrowLeftIcon}
          alt=""
          backgroundColor="#202427"
          borderRadius="23px"
          onClick={() => handlePrev()}
        />
      </div>
      <div>
        <IconButton
          width={viewport === 'xs' || viewport === 'sm' ? '30px' : '46px'}
          height={viewport === 'xs' || viewport === 'sm' ? '30px' : '46px'}
          icon={ArrowRightIcon}
          alt=""
          backgroundColor="#202427"
          borderRadius="23px"
          onClick={() => handleNext()}
        />
      </div>
    </div>
  )
}

export default Pagination
