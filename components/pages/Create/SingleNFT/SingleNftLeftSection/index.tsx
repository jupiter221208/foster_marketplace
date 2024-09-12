import React from 'react'
import { useViewport } from 'utils'

// third-party
import Dropzone from 'react-dropzone'
import ModelViewer from 'components/ModelViewer'
import DimensionMenu from 'components/Menu/DimensionMenu'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'

//component
import MintAudioPlayer from 'components/MediaPlayer/MintAudioPlayer'

// resources
import UploadGreenIcon from 'assets/icons/upload-green-24x24.svg?component'
import TrashBin from 'assets/icons/trash-bin.svg?component'

// styles
import styles from './index.module.scss'

const SingleNftLeftSection = props => {
  const {
    currentStep,
    nftType,
    nftArt,
    nftUrl,
    nftCover,
    nftImage,
    artWidth,
    setNftArt,
    setNftImage,
    setTakeSnapshotStatus,
    takeSnapshotStatus,
    handleShowAlert,
    dimensionList,
    selectedDimension,
    handleChangeDimension,
    handleDeleteNftArt,
  } = props

  const viewport = useViewport()

  return (
    <div className={styles.container}>
      {nftArt === null ? (
        <div className="w-full mt-[30px] lg:mt-[0px]">
          <Dropzone
            onDropAccepted={acceptedFiles => {
              acceptedFiles.length !== 0 ? setNftArt(acceptedFiles) : handleShowAlert('nft', 'unknown')
            }}
            onDropRejected={rejectedFiles => {
              handleShowAlert('nft', rejectedFiles[0]?.errors[0]?.code)
            }}
            accept={{
              'image/jpeg': [],
              'image/png': [],
              'image/gif': [],
              'video/mp4': [],
              'audio/mpeg': [],
              'audio/wav': [],
              'model/gltf-binary': ['.glb'],
            }}
            maxFiles={1}
            maxSize={104857600}
          >
            {({ getRootProps, getInputProps }) => (
              <section className={styles.dropzone}>
                <div {...getRootProps()} className={styles.selectArea}>
                  <input {...getInputProps()} />
                  <UploadGreenIcon alt="" />
                  <p className={styles.uploadText}>Upload Here</p>
                  <p className={styles.text}>
                    Supported File Formats
                    <br />
                    .png .jpeg .mp4 .mp3 .gif .glb
                  </p>
                  <p className={`${styles.greenText} mt-[15px]`}>Max File Size 100mb</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      ) : (
        <div className={`max-w-[400px] xl:max-w-[550px] relative w-full flex flex-wrap justify-center z-10`}>
          {nftType === 'vr' && nftUrl ? (
            <div className="max-w-[400px] xl:max-w-[550px] w-full mx-auto aspect-square">
              <ModelViewer
                path={nftUrl}
                preserveDrawingBuffer
                getSnapshot={{
                  onSnapshot: image => {
                    setNftImage(URL.createObjectURL(image))
                    setTakeSnapshotStatus(false)
                  },
                  status: takeSnapshotStatus,
                }}
              />
            </div>
          ) : nftType === 'image' || nftType === 'image/gif' ? (
            <div
              className={styles.artArea}
              style={{
                width:
                  viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                    ? artWidth
                    : viewport === 'lg'
                    ? '400px'
                    : '550px',
                minWidth:
                  viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                    ? artWidth
                    : viewport === 'lg'
                    ? '400px'
                    : '550px',
                height:
                  viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                    ? artWidth
                    : viewport === 'lg'
                    ? '400px'
                    : '550px',
                marginLeft: viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '-16px' : '0px',
                marginRight: viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '-16px' : '0px',
              }}
            >
              {nftImage !== '' && artWidth !== 0 && (
                <img src={nftImage} alt="" className="w-full h-full object-contain z-10" />
              )}
            </div>
          ) : (
            <div
              className={`${styles.artArea}`}
              style={{
                width: artWidth,
                height:
                  artWidth +
                  (nftType === 'audio' && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') ? 100 : 0),
                marginLeft: viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '-16px' : '0px',
                marginRight: viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '-16px' : '0px',
              }}
            >
              <div className={styles.blurImage} />
              {nftType === 'video' && nftArt !== null ? (
                <video controls className="w-full h-full z-10" id="video">
                  <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                  Your browser does not support the video tag.
                </video>
              ) : nftType === 'audio' && nftArt !== null ? (
                <div className="w-full h-full z-10">
                  <MintAudioPlayer src={URL.createObjectURL(nftArt[0])} />
                  {nftImage !== '' && artWidth !== 0 && (
                    <div className="w-full h-full flex justify-center z-10">
                      <img src={nftImage} alt="" className="mt-[10%] w-[69%] h-[69%] object-contain z-10" />
                    </div>
                  )}
                </div>
              ) : nftImage !== '' && artWidth !== 0 ? (
                <img src={nftImage} alt="" className="w-full h-full rounded-[12px] object-contain z-10" />
              ) : (
                <div
                  className={`${styles.artArea}`}
                  style={{
                    width: artWidth,
                    height: artWidth,
                    marginLeft: viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '-16px' : '0px',
                    marginRight: viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '-16px' : '0px',
                  }}
                />
              )}
            </div>
          )}

          {nftArt !== null ? (
            <div className="w-full mt-[5px] flex justify-between">
              {currentStep === 1 &&
              (nftType === 'image' ||
                (nftType === 'audio' && nftImage !== '' && nftCover !== null && nftCover[0].type !== 'image/gif')) ? (
                <DimensionMenu
                  dimensionList={dimensionList}
                  selectedDimension={selectedDimension}
                  onSelect={item => handleChangeDimension(item)}
                />
              ) : (
                <>&nbsp;</>
              )}
              {currentStep === 1 ? (
                <IconButtonWithSVG
                  icon={<TrashBin className={styles.trashIcon} />}
                  onClick={() => handleDeleteNftArt()}
                  backgroundColor="transparent"
                />
              ) : (
                <>&nbsp;</>
              )}
            </div>
          ) : (
            <div className={styles.preview}>Preview will display here</div>
          )}
        </div>
      )}
    </div>
  )
}

export default SingleNftLeftSection
