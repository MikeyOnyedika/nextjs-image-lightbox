import Styles from './styles.module.css'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { FaAngleRight, FaAngleLeft, FaRegCopy } from 'react-icons/fa'
import { HiOutlineDownload, HiZoomIn, HiZoomOut } from 'react-icons/hi'
import { IconContext } from 'react-icons'
import { CloseBtn } from './close'
import { useImageZoom } from './useImageZoom'

export const Lightbox = ({ images, close }) => {
	const [imageIndex, setImageIndex] = useState(0)
	const [largeImgOverflow, setLargeImgOverflow] = useState({ x: false, y: false })

	const sliderWrapperRef = useRef()
	const largeImageViewWrapperRef = useRef()
	const activePreviewImgRef = useRef()
	const largeImgRef = useRef()
	const largeImgWrapperRef = useRef()

	const { zoomIn, zoomOut, zoomLevel, normalizeZoom, zoomDirection } = useImageZoom()

	const maxIndex = images.length - 1

	//if currently selected image preview is not visible, scroll it into view
	useEffect(() => {
		normalizeZoom()
		activePreviewImgRef.current.scrollIntoView({ behavior: "smooth" })
	}, [imageIndex])



	// useEffect(() => {
	// 	const image = largeImgRef.current

	// 	image.addEventListener("mousedown", handleMouseDown) 

	// 	function handleMouseDown(e) {
	// 		let startX = e.clientX
	// 		let startY = e.clientY
			
	// 	}

	// 	return () => {
	// 		image.removeEventListener("mousedown", handleMouseDown)
	// 	}
	// }, [])



	useEffect(() => {
		largeImgRef.current.style.scale = zoomLevel
		setLargeImgOverflow((prev) => {
			const image = largeImgRef.current
			const parentWrapper = largeImgWrapperRef.current

			const parentHeight = parentWrapper.scrollHeight
			const imageHeight = image.clientHeight

			const parentWidth = parentWrapper.scrollWidth
			const imageWidth = image.clientWidth

			let scrollX = false;
			let scrollY = false


			if (parentWidth > imageWidth) {
				scrollX = true
			} else {
				scrollX = false
			}


			if (parentHeight > imageHeight) {
				scrollY = true
			} else {
				scrollY = false
			}

			return {
				x: scrollX,
				y: scrollY
			}

		})
	}, [zoomLevel])

	function scrollForward() {
		sliderWrapperRef.current.scrollBy({ top: 0, left: 200, behavior: "smooth" })
	}


	function scrollBackward() {
		sliderWrapperRef.current.scrollBy({ top: 0, left: -200, behavior: "smooth" })
	}

	function getImageUrl() {
		const image = images[imageIndex]
		let text = typeof image.image == "object" ? image.image.src : image.image
		if (!text.startsWith("http://") && !text.startsWith("https://")) {
			text = window.location.origin + text
		}

		return text
	}

	function copyImageUrl() {
		const text = getImageUrl()
		navigator.clipboard.writeText(text)
		alert("Image url copied! : " + text)
	}

	function prevImage() {
		setImageIndex(prev => {
			if (prev === 0) return maxIndex
			return prev - 1
		})
	}

	function nextImage() {
		setImageIndex(prev => {
			if (prev === maxIndex) return 0
			return prev + 1
		})
	}


	return (
		<div className={Styles.Wrapper}>
			<div className={Styles.ContentWrapper}>
				<div className={Styles.ToolsMenu}>
					<h3>{images[imageIndex].text}  </h3>

					<div className={Styles.Options}>
						<button type='button' onClick={() => zoomIn()} className={Styles.ToolBtn}>
							<IconContext.Provider value={{ className: Styles.OptionBtnIcon }}>
								<HiZoomIn />
							</IconContext.Provider>
						</button>
						<button type='button' onClick={() => zoomOut()} className={Styles.ToolBtn}>
							<IconContext.Provider value={{ className: Styles.OptionBtnIcon }}>
								<HiZoomOut />
							</IconContext.Provider>
						</button>
						<button type='button' onClick={() => copyImageUrl()} className={Styles.ToolBtn}>
							<IconContext.Provider value={{ className: Styles.OptionBtnIcon }}>
								<FaRegCopy />
							</IconContext.Provider>
						</button>
						<a href={getImageUrl()} download className={Styles.ToolBtn}>
							<IconContext.Provider value={{ className: Styles.OptionBtnIcon }}>
								<HiOutlineDownload />
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

					<div className={Styles.LargeImageWrapper} ref={largeImgWrapperRef}>
						<Image
							className={`${Styles.LargeImage} ${largeImgOverflow.x == true && largeImgOverflow.y == true ? (
								Styles.LargeImage__ShiftXY
							) : (
								largeImgOverflow.x == true ? (
									Styles.LargeImage__ShiftX
								) : (
									largeImgOverflow.y == true ? (
										Styles.LargeImage__ShiftY
									) : (
										Styles.LargeImage__NoShift
									)
								)
							)
								}`}
							alt={images[imageIndex].text}
							src={images[imageIndex].image}
							fill
							sizes="90vw"
							ref={largeImgRef}
						// placeholder="blur"
						// blurDataURL={images[imageIndex].blurHash}
						/>
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
									<Image className={Styles.SliderImage} alt={item.text} src={item.image} fill
										// placeholder="blur" 
										sizes="33vw"
									// blurDataURL={item.blurHash}
									/>

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

