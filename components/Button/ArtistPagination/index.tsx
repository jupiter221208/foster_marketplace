import React from 'react'

// custom components
import IconButton from 'components/Button/IconButton'
import Accordion from 'components/Accordion'

// custom functions
import { useViewport } from 'utils'

// images and icons
import ArrowLeftIcon from 'assets/icons/arrow-left-white.svg'
import ArrowRightIcon from 'assets/icons/arrow-right-white.svg'

// json
import RowCountList from 'assets/json/dashboard/row-count-list.json'

// styles
import styles from './index.module.scss'

const ArtistPagination = props => {
  const { rowCount, handlePrev, handleNext, currentPage, totalCount, setRowCount } = props
  const viewport = useViewport()

  return (
    <div className={styles.container}>
      <div>Items per page:</div>
      <div className="relative">
        <Accordion label={rowCount.toString()} data={RowCountList} onClick={item => setRowCount(item.value)} />
      </div>
      <div>
        {(currentPage - 1) * rowCount + 1} -&nbsp;
        {currentPage * rowCount}
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

export default ArtistPagination
