import Styles from './styles.module.css'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { FaArrowDown, FaAngleRight, FaAngleLeft, FaEdit } from 'react-icons/fa'
import { HiZoomIn, HiZoomOut } from 'react-icons/hi'
import { IconContext } from 'react-icons'
import { CloseBtn } from './close'

export const Lightbox = ({ images, close }) => {
	const [imageIndex, setImageIndex] = useState(0)
	const sliderWrapperRef = useRef()
	const largeImageViewWrapperRef = useRef()
	const activePreviewImgRef = useRef()
	const largeImgRef = useRef()
	const { zoomIn, zoomOut, zoomLevel, normalizeZoom } = useImageZoom()

	const maxIndex = images.length - 1

	//if currently selected image preview is not visible, scroll it into view
	useEffect(() => {
		activePreviewImgRef.current.scrollIntoView({ behavior: "smooth" })
	}, [imageIndex])


	useEffect(() => {
		largeImgRef.current.style.scale = zoomLevel
		largeImgRef.current.style["object-position"] = "50%"
	}, [zoomLevel])

	function scrollForward() {
		console.log("scroll forward")
		sliderWrapperRef.current.scrollBy({ top: 0, left: 200, behavior: "smooth" })
	}


	function scrollBackward() {
		sliderWrapperRef.current.scrollBy({ top: 0, left: -200, behavior: "smooth" })
	}

	function copyImageUrl(text) {
		navigator.clipboard.writeText(text)
		alert("Image url copied!")
	}

	function prevImage() {
		normalizeZoom()
		setImageIndex(prev => {
			if (prev === 0) return maxIndex
			return prev - 1
		})
	}

	function nextImage() {
		normalizeZoom()
		setImageIndex(prev => {
			if (prev === maxIndex) return 0
			return prev + 1
		})
	}


	return (
		<div className={Styles.Wrapper}>
			<div className={Styles.ContentWrapper}>

				<div className={Styles.ToolsMenu}>
					<div className={Styles.Options}>
						<button type='button' onClick={() => zoomIn()} className={Styles.CopyBtn}>
							<IconContext.Provider value={{ className: Styles.OptionBtnIcon }}>
								<HiZoomIn />
							</IconContext.Provider>
						</button>
						<button type='button' onClick={() => zoomOut()} className={Styles.CopyBtn}>
							<IconContext.Provider value={{ className: Styles.OptionBtnIcon }}>
								<HiZoomOut />
							</IconContext.Provider>
						</button>
						<button type='button' onClick={() => copyImageUrl(images[imageIndex].image)} className={Styles.CopyBtn}>
							<IconContext.Provider value={{ className: Styles.OptionBtnIcon }}>
								<FaEdit />
							</IconContext.Provider>
						</button>
						<a href="" download={images[imageIndex].image}>
							<IconContext.Provider value={{ className: Styles.OptionBtnIcon }}>
								<FaArrowDown />
							</IconContext.Provider>
						</a>
					</div>

					<button type='button' className={Styles.CloseBtn} onClick={close}>
						<CloseBtn />
					</button>
				</div>

				<div className={Styles.LargeImageViewWrapper} ref={largeImageViewWrapperRef}>
					<button onClick={prevImage} className={`${Styles.LargeImgNavBtn} ${Styles.LargeImgNavBtn__Left}`}>
						<IconContext.Provider value={{ className: Styles.LargeBtnIcon }}>
							<FaAngleLeft />
						</IconContext.Provider>
					</button>

					<div className={Styles.LargeImageWrapper} >
						<Image className={Styles.LargeImage} alt={images[imageIndex].text} src={images[imageIndex].image} fill ref={largeImgRef} />
					</div>

					<button onClick={nextImage} className={`${Styles.LargeImgNavBtn} ${Styles.LargeImgNavBtn__Right}`}>
						<IconContext.Provider value={{ className: Styles.LargeBtnIcon }}>
							<FaAngleRight />
						</IconContext.Provider>
					</button>
				</div>

				<div className={Styles.ImagePreviewWrapper}>
					<button type='button' onClick={() => scrollBackward()} className={`${Styles.SliderBtn} ${Styles.SliderBtn__Left}`}>
						<IconContext.Provider value={{ className: Styles.BtnIcon }}>
							<FaAngleLeft />
						</IconContext.Provider>
					</button>

					<ul className={Styles.Slider} ref={sliderWrapperRef}>
						{
							images.map((item, index) => (
								<li key={index} className={`${Styles.SliderItemWrapper} ${item.id === images[imageIndex].id ? Styles.ItemActive : ""}`} onClick={() => setImageIndex(index)} tabIndex={0} ref={item.id === images[imageIndex].id ? activePreviewImgRef : null}>
									<Image className={Styles.SliderImage} alt={item.text} src={item.image} fill />
								</li>
							))
						}
					</ul>

					<button type='button' onClick={() => scrollForward()} className={`${Styles.SliderBtn} ${Styles.SliderBtn__Right}`}>
						<IconContext.Provider value={{ className: Styles.BtnIcon }}>
							<FaAngleRight />
						</IconContext.Provider>
					</button>
				</div>
			</div>
		</div >
	)
}

function useImageZoom() {
	// zoom level ---- 0.4x 0.6x 0.8x 1x 1.2x 1.4x 1.6x 1.8x 2.0x
	const [currentZoomLevel, setCurrentZoomLevel] = useState(1)
	const maxZoomInLevel = 2.4
	const maxZoomOutLevel = 0.4
	const delta = 0.2

	function zoomIn() {
		setCurrentZoomLevel(
			prev => {
				if (prev === maxZoomInLevel) {
					console.log("prev: ", prev)
					return prev
				}
				return sumDecimals(prev, delta)
			}
		)
	}

	function zoomOut() {
		setCurrentZoomLevel(
			prev => {
				if (prev === maxZoomOutLevel) {
					console.log("prev: ", prev)
					return prev
				}
				return subtractDecimals(prev, delta)
			}
		)
	}


	// sumDecimals  and subtractDecimals are used to avoid the weird issue with adding or subtracting less than 1 numbers in javascript
	function sumDecimals(num1, num2) {
		return ((num1 * 10) + (num2 * 10)) / 10
	}

	function subtractDecimals(num1, num2) {
		return ((num1 * 10) - (num2 * 10)) / 10
	}

	function normalizeZoom() {
		setCurrentZoomLevel(1)
	}

	return {
		zoomIn,
		zoomOut,
		zoomLevel: currentZoomLevel,
		normalizeZoom
	}

}