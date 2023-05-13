import Styles from './styles.module.css'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { FaAngleRight, FaAngleLeft, FaRegCopy } from 'react-icons/fa'
import { HiOutlineDownload, HiZoomIn, HiZoomOut } from 'react-icons/hi'
import { IconContext } from 'react-icons'
import { CloseBtn } from './CloseBtn'
import { useImageZoom } from './useImageZoom'
import { Alert } from './Alert'
import { useExpiringState } from './useExpiringState'
import { FitToScreen } from "./FitToScreen"

export const Lightbox = ({ isOpen, images, close }) => {
	const [imageIndex, setImageIndex] = useState(0)
	const [largeImgOverflow, setLargeImgOverflow] = useState({ x: false, y: false })
	const [alertMessage, setAlertMessage, isAlertMessageExpired, respawn] = useExpiringState(null)


	const wrapperRef = useRef()
	const sliderWrapperRef = useRef()
	const largeImageViewWrapperRef = useRef()
	const activePreviewImgRef = useRef()
	const largeImgRef = useRef()
	const largeImgWrapperRef = useRef()
	const largeImgItem = useRef()

	const { zoomIn, zoomOut, zoomLevel, normalizeZoom, maxZoomInLevel, maxZoomOutLevel } = useImageZoom()

	// the index of the last image in the list of images used in the lightbox
	const maxIndex = images.length - 1


	useEffect(() => {
		// run lightbox open animation
		startOpenAnimation()

		function handleOnMouseDown(e) {
			e.preventDefault()

			sliderWrapperRef.current.addEventListener("mouseup", handleMouseUp)
			sliderWrapperRef.current.addEventListener("mousemove", handleMouseMove)


			function handleMouseUp(e) {
				e.preventDefault()

				sliderWrapperRef.current.removeEventListener("mousemove", handleMouseMove)
			}


			let mouseStartX = e.clientX

			function handleMouseMove(e) {
				e.preventDefault()

				const mouseEndX = e.clientX

				const diff = Math.abs(mouseStartX - mouseEndX)
				if (mouseStartX > mouseEndX) {
					sliderWrapperRef.current.scrollBy({ left: diff })
				}else if(mouseStartX < mouseEndX){
					sliderWrapperRef.current.scrollBy({ left: -diff })
				}


				mouseStartX = mouseEndX
			}
		}

		if (sliderWrapperRef.current != null) {
			sliderWrapperRef.current.addEventListener("mousedown", handleOnMouseDown)
		}

		return () => {
			if (sliderWrapperRef.current != null) {
				sliderWrapperRef.current.removeEventListener("mousedown", handleOnMouseDown)
			}
		}
	}, [])

	// setup swipe to navigate the large image
	useEffect(() => {
		if (zoomLevel === 1) {
			// set up event handlers 
			largeImgWrapperRef.current.addEventListener("mousedown", handleOnMouseDown)
		} else {
			// tear down event handlers
			largeImgWrapperRef.current.removeEventListener("mousedown", handleOnMouseDown)
		}


		function handleOnMouseDown(e) {
			e.preventDefault()

			const mouseStartX = e.clientX

			// then set a listener for when mouse is lifted
			largeImgWrapperRef.current.addEventListener("mouseup", handleOnMouseUp)

			function handleOnMouseUp(e) {
				e.preventDefault()

				const mouseEndX = e.clientX

				const threshold = 25
				if (Math.abs(mouseEndX - mouseStartX) > threshold) {
					if (mouseEndX < mouseStartX) {
						nextImage()
					} else if (mouseEndX > mouseStartX) {
						prevImage()
					}
				}

				largeImgWrapperRef.current.removeEventListener("mouseup", handleOnMouseUp)
			}
		}


		return () => {
			if (largeImgWrapperRef.current != null) {
				largeImgWrapperRef.current.removeEventListener("mousedown", handleOnMouseDown)
			}
		}

	}, [zoomLevel])


	// this is run whenever a new image is selected. i.e whenever imageIndex changes.
	// Handle image panning here
	useEffect(() => {
		let isDown = false
		let startCoords = {}
		let scrollLeft;
		let scrollTop;
		let canHandleMouseMove = true

		addEventListeners()

		function handleMouseDown(e) {
			e.preventDefault()
			isDown = true;

			largeImgItem.current.classList.add(Styles.Draggable)

			// makes sure the start coordinate is measured relative to were the image container started as opposed to measured relative to the document
			startCoords = {
				x: e.pageX - largeImgItem.current.offsetLeft,
				y: e.pageY - largeImgItem.current.offsetTop,
			}

			// take note of the current amount of scrolling the image container already has
			scrollLeft = largeImgItem.current.scrollLeft
			scrollTop = largeImgItem.current.scrollTop

		}

		function handleMouseLeave(e) {
			e.preventDefault()
			isDown = false;
			largeImgItem.current.classList.remove(Styles.Draggable)
		}

		function handleMouseUp(e) {
			e.preventDefault()
			isDown = false;
			largeImgItem.current.classList.remove(Styles.Draggable)
		}

		function handleMouseMove(e) {
			if (!canHandleMouseMove) return;
			if (!isDown) return;

			// prevent calling the handler again before it finishes running
			canHandleMouseMove = false
			e.preventDefault()

			const scrollLeft = largeImgItem.current.scrollLeft
			const scrollTop = largeImgItem.current.scrollTop

			// again, measure the mouse coordinate relative to the start position of the image container, not the whole document
			const finalMouseX = e.pageX - largeImgItem.current.offsetLeft
			const finalMouseY = e.pageY - largeImgItem.current.offsetTop

			// calcualte the change in the position of the mouse
			const deltaX = finalMouseX - startCoords.x
			const deltaY = finalMouseY - startCoords.y

			const speed = 30

			// dividing delta reduces it and therefore reduces the amount of change in the coordinate of the image container. This slows the movement down and that's good 
			largeImgItem.current.scrollLeft = scrollLeft - (deltaX !== 0 ? deltaX / speed : deltaX)
			largeImgItem.current.scrollTop = scrollTop - (deltaY !== 0 ? deltaY / speed : deltaY)

			canHandleMouseMove = true
			// allow calling the handler again after 100ms 
			// setTimeout(() => {
			// 	canHandleMouseMove = true	
			// }, 50);
		}


		function removeListeners() {
			if (largeImgRef.current != null) {
				const img = largeImgRef.current
				img.removeEventListener("mousedown", handleMouseDown)
				img.removeEventListener("mouseup", handleMouseUp)
				img.removeEventListener("mousemove", handleMouseMove)
				img.removeEventListener("mouseleave", handleMouseLeave)
			}
		}

		function addEventListeners() {
			if (largeImgRef.current != null) {
				const img = largeImgRef.current
				img.addEventListener("mousedown", handleMouseDown)
				img.addEventListener("mouseup", handleMouseUp)
				img.addEventListener("mousemove", handleMouseMove)
				img.addEventListener("mouseleave", handleMouseLeave)
			}
		}

		return () => {
			removeListeners()
		}

	}, [imageIndex])

	//if currently selected image preview is not visible, scroll it into view
	useEffect(() => {

		// the delay gotten from temporarily putting the scroll call onto the queue makes both scrolling work without either the scroll for the largeImgItem or that for the sliderWrapperRef from breaking
		setTimeout(() => {
			largeImgItem.current.scrollIntoView({ behavior: "smooth" })
		}, 0)

		// only scroll to element if it's not in the visible part of the slider. a.k.a if it's hidden
		if (checkSlideImageVisible() === false) {
			sliderWrapperRef.current.scrollTo({ left: activePreviewImgRef.current.offsetLeft, behavior: "smooth" })
		}

		// if all 4 boundaries of the image are found inside the slider's visible boundaries, then it's visible
		function checkSlideImageVisible() {
			const activeImg = activePreviewImgRef.current
			const slider = sliderWrapperRef.current

			const activeImgRect = activeImg.getBoundingClientRect()
			const sliderRect = slider.getBoundingClientRect()

			if (
				activeImgRect.top >= sliderRect.top &&
				activeImgRect.right <= sliderRect.right &&
				activeImgRect.bottom <= sliderRect.bottom &&
				activeImgRect.left >= sliderRect.left
			) {
				return true
			}
			return false
		}

	}, [imageIndex])


	// 
	useEffect(() => {
		largeImgRef.current.style.scale = zoomLevel
		setLargeImgOverflow((prev) => {
			const image = largeImgRef.current
			const parentWrapper = largeImgItem.current
			const parentWidth = parentWrapper.scrollWidth
			const imageWidth = image.offsetWidth

			const parentHeight = parentWrapper.scrollHeight
			const imageHeight = image.offsetHeight

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

	function getUrlTextRegardlessOfDomain() {
		const image = images[imageIndex]
		let text = typeof image.image == "object" ? image.image.src : image.image
		return text
	}

	// basically preparing the full path of the image
	function copyImageUrl() {
		let text = getUrlTextRegardlessOfDomain()
		if (!text.startsWith("http://") && !text.startsWith("https://")) {
			if (typeof window !== "undefined") {
				text = window.location.origin + text
			}
		}
		navigator.clipboard.writeText(text)
		setAlertMessage("Image URL copied!")
		respawn()
	}

	// the setTimeout is essentially to give a short delay for normalizeZoom() to acutally take effect before page transition is carried out
	function prevImage() {
		normalizeZoom()
		setTimeout(() => {
			setImageIndex(prev => {
				if (prev === 0) return maxIndex
				return prev - 1
			})
		}, 0);
	}

	function nextImage() {
		normalizeZoom()
		setTimeout(() => {
			setImageIndex(prev => {
				if (prev === maxIndex) return 0
				return prev + 1
			})
		}, 0)
	}

	function startOpenAnimation() {
		const wrapper = wrapperRef.current
		wrapper.classList.add(Styles.OpenLightbox)
	}

	// once the Styles.CloseLightbox class is added to wrapper div, close animation starts.
	function startCloseAnimation(e) {
		e.preventDefault()
		// trigger the close animation
		const wrapper = wrapperRef.current
		// remove the OpenLightbox class if it's already on the wrapper
		if (wrapper.classList.contains(Styles.OpenLightbox)) {
			wrapper.classList.remove(Styles.OpenLightbox)
		}
		// add the class for the close animation if it's not already added
		if (wrapper.classList.contains(Styles.CloseLightbox) === false) {
			wrapper.classList.add(Styles.CloseLightbox)
		}
	}

	//  When close animation finishes running, call the close() which sets the state of the lightbox to false, essentially unmounting the component
	function handleAnimationEnd(e) {
		e.preventDefault()
		if (typeof window === "undefined") return;
		const wrapper = wrapperRef.current
		if (wrapper.classList.contains(Styles.CloseLightbox)) {
			// now, close lightbox
			close()
		}
	}

	return (
		<div className={`${Styles.Wrapper} `} ref={wrapperRef} onAnimationEnd={handleAnimationEnd} >
			<Alert message={alertMessage} className={isAlertMessageExpired ? Styles.Hide : Styles.Show} />

			<div className={Styles.ContentWrapper}>
				<div className={Styles.ToolsMenu}>
					<h3>{images[imageIndex].text} </h3>
					<div className={Styles.Options}>
						<button type='button' onClick={() => normalizeZoom()} className={Styles.ToolBtn}>
							<FitToScreen className={`${Styles.OptionBtnIcon} ${Styles.FitSVG} ${zoomLevel === 1 ? Styles.Disabled : Styles.Enabled}`} />
						</button>
						<button type='button' onClick={() => zoomIn()} className={Styles.ToolBtn}>
							<IconContext.Provider value={{ className: `${Styles.OptionBtnIcon} ${zoomLevel === maxZoomInLevel ? Styles.Disabled : Styles.Enabled}` }}>
								<HiZoomIn />
							</IconContext.Provider>
						</button>
						<button type='button' onClick={() => zoomOut()} className={Styles.ToolBtn}>
							<IconContext.Provider value={{ className: `${Styles.OptionBtnIcon} ${zoomLevel === maxZoomOutLevel ? Styles.Disabled : Styles.Enabled}` }}>
								<HiZoomOut />
							</IconContext.Provider>
						</button>
						<button type='button' onClick={() => copyImageUrl()} className={Styles.ToolBtn}>
							<IconContext.Provider value={{ className: `${Styles.OptionBtnIcon} ${Styles.Enabled}` }}>
								<FaRegCopy />
							</IconContext.Provider>
						</button>

						<a href={getUrlTextRegardlessOfDomain()} download className={Styles.ToolBtn}>
							<IconContext.Provider value={{ className: `${Styles.OptionBtnIcon} ${Styles.Enabled}` }}>
								<HiOutlineDownload />
							</IconContext.Provider>
						</a>
					</div>

					<button type='button' className={Styles.CloseBtn} onClick={startCloseAnimation}>
						<CloseBtn />
					</button>
				</div>

				<div className={Styles.LargeImageViewWrapper} ref={largeImageViewWrapperRef}>
					<button onClick={prevImage} className={`${Styles.LargeImgNavBtn} ${Styles.LargeImgNavBtn__Left}`}>
						<IconContext.Provider value={{ className: Styles.LargeBtnIcon }}>
							<FaAngleLeft />
						</IconContext.Provider>
					</button>

					<ul className={Styles.LargeImageWrapper} ref={largeImgWrapperRef}>
						{
							images.map((item, index) => (
								<li key={index} className={Styles.LargeImgItem}
									ref={item.id === images[imageIndex].id ? largeImgItem : null}
								>
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
										alt={item.text}
										src={item.image}
										fill
										sizes="(min-width: 360px) 30rem, (min-width: 500px) 50rem"
										// placeholder="blur"
										// blurDataURL={images[imageIndex].blurHash}
										ref={item.id === images[imageIndex].id ? largeImgRef : null}
									/>
								</li>
							))
						}
					</ul>

					<button onClick={nextImage} className={`${Styles.LargeImgNavBtn} ${Styles.LargeImgNavBtn__Right}`}>
						<IconContext.Provider value={{ className: Styles.LargeBtnIcon }}>
							<FaAngleRight />
						</IconContext.Provider>
					</button>
				</div>

				<div className={Styles.ImagePreviewWrapper}>
					{/* <button type='button' onClick={() => scrollBackward()} className={`${Styles.SliderBtn} ${Styles.SliderBtn__Left}`}>
						<IconContext.Provider value={{ className: Styles.BtnIcon }}>
							<FaAngleLeft />
						</IconContext.Provider>
					</button> */}

					<ul className={Styles.Slider} ref={sliderWrapperRef}>
						{
							images.map((item, index) => (
								<li key={index} className={`${Styles.SliderItemWrapper} ${item.id === images[imageIndex].id ? Styles.ItemActive : ""}`} onClick={() => setImageIndex(index)} tabIndex={0} ref={item.id === images[imageIndex].id ? activePreviewImgRef : null}>
									<Image className={Styles.SliderImage} alt={item.text} src={item.image} fill
										sizes="20vw"
									/>
								</li>
							))
						}
					</ul>

					{/* <button type='button' onClick={() => scrollForward()} className={`${Styles.SliderBtn} ${Styles.SliderBtn__Right}`}>
						<IconContext.Provider value={{ className: Styles.BtnIcon }}>
							<FaAngleRight />
						</IconContext.Provider>
					</button> */}
				</div>
			</div>
		</div >
	)
}

