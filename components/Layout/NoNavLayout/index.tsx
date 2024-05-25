import React, { FC, useEffect } from 'react'

// third party components
import { useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'
import { setColorTheme } from 'utils/helpers'

interface NoNavLayoutProps {
  children?: any
}

const NoNavLayout: FC<NoNavLayoutProps> = ({ children }) => {
  const lightDarkMode = useSelector(state => (state as any).lightMode)

  useEffect(() => {
    setColorTheme(lightDarkMode)
  }, [])

  return (
    <div className={styles.container}>
      <>
        <main className="w-full flex justify-center min-h-[calc(100vh)] lg:min-h-[calc(100vh)]">{children}</main>
      </>
    </div>
  )
}

export default NoNavLayout
