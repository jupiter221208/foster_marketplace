import React, { useState, useEffect, useMemo } from 'react'

import styles from './index.module.scss'

const AuctionStartPage = props => {
  const { onClose } = props
  return (
    <div className="w-full h-full bg-[#00ffff]">
      <button onClick={onClose}>back</button>
    </div>
  )
}

export default AuctionStartPage
