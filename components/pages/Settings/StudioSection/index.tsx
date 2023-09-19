import React, { useEffect, useState } from 'react'

// next components

// third party components
import { useDispatch } from 'react-redux'

// custom components
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'

// images and icons

// styles
import styles from './index.module.scss'

// call apis

const StudioSection = prop => {
  const { success } = prop
  const viewport = useViewport()

  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [enableSave, setEnableSave] = useState(true)

  const checkEnableSave = () => {}

  const handleSaveUserInfo = async () => {}

  useEffect(() => {
    checkEnableSave()
  }, [note])

  return (
    <div className={styles.container}>
      <div className="w-full flex justify-center">
        <div className={styles.content}>
          <div className={styles.innercontent}>
            <div className="mt-[0px] lg:mt-5">
              <Input
                error={errorMessage}
                value={title}
                backgroundColor={'var(--studio-title-bg)'}
                fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                color="var(--text-gray-200-color)"
                placeholder="Add a note to your collectors when they place an order for any of your enabled studio items."
                onChange={value => {
                  if (errorMessage.length > 0) setErrorMessage('')
                  setTitle(value)
                }}
              />
            </div>
            <div className="mt-[10px] lg:mt-[30px] h-fit">
              <Textarea
                value={note}
                fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                color="var(--text-gray-200-color)"
                placeholder="Insert note to collector"
                width="100%"
                height="200px"
                label01="Max Characters 1000"
                label02={1000 - note?.length === 1000 ? '' : `${1000 - note?.length} Characters left`}
                onChange={value => setNote(value)}
              />
            </div>

            <div className="mt-[60px] lg:mt-[20px] mb-[10px] lg:mb-[158px] w-full flex justify-center lg:justify-end items-center gap-6">
              {enableSave ? (
                <GradientButton
                  label="Save"
                  onClick={() => {
                    handleSaveUserInfo()
                  }}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50%' : ''}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '52px'}
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                  paddingLeft={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                  paddingRight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                />
              ) : (
                <GradientButton
                  label="Save"
                  disabled={true}
                  onClick={() => {}}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50%' : ''}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '52px'}
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                  paddingLeft={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                  paddingRight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioSection
