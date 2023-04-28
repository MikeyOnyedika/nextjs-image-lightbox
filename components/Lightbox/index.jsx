import Styles from './styles.module.css'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { FaArrowDown, FaAngleRight, FaAngleLeft, FaEdit } from 'react-icons/fa'
import { HiZoomIn, HiZoomOut } from 'react-icons/hi'
import { IconContext } from 'react-icons'
import { CloseBtn } from './close'

export const Lightbox = ({ images, close }) => {
	const [imageIndex, setImageIndex] = useState(0)
	const [currentZoomLevel, setCurrentZoomLevel] = useState(0)
	const sliderWrapperRef = useRef()
	const largeImageViewWrapperRef = useRef()
	const activePreviewImgRef = useRef()
	const largeImgRef = useRef()


	const maxIndex = images.length - 1
	const maxZoomInLevel = 5
	const maxZoomOutLevel = -5

	//if currently selected image preview is not visible, scroll it into view
	useEffect(() => {
		activePreviewImgRef.current.scrollIntoView({ behavior: "smooth" })
	}, [imageIndex])


	useEffect(() => {
		let width = largeImgRef.current.clientWidth
		console.log(width)

		const multiplier = 0.2 + currentZoomLevel

		width = width * multiplier

		console.log(width)
	}, [currentZoomLevel])


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

	function zoomIn() {
		setCurrentZoomLevel(
			prev => {
				if (prev === maxZoomInLevel) return prev
				return prev + 1
			}
		)
	}

	function zoomOut() {
		setCurrentZoomLevel(
			prev => {
				if (prev === maxZoomOutLevel) return prev
				return prev - 1
			}
		)
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
					<div className={Styles.LargeImageWrapper} >
						<Image className={Styles.LargeImage} alt={images[imageIndex].text} src={images[imageIndex].image} fill ref={largeImgRef} />

						<button onClick={prevImage} className={Styles.Btn}>
							<IconContext.Provider value={{ className: `${Styles.LargeBtnIcon} ${Styles.Left}` }}>
								<FaAngleLeft />
							</IconContext.Provider>
						</button>

						<button onClick={nextImage} className={Styles.Btn}>
							<IconContext.Provider value={{ className: `${Styles.LargeBtnIcon} ${Styles.Right}` }}>
								<FaAngleRight />
							</IconContext.Provider>
						</button>
					</div>
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


function useIntersectionObserver() {
	const [isVisible, setIsVisible] = useState()
	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			setTimeout(
				() => {
					if (entry.intersectionRatio > 0) {
						// element is visible
						setIsVisible(true)
					} else {
						// element is not visible
						setIsVisible(false)
					}
				}, 300
			)
		})

	}, {
		root: null,
		rootMargin: '0px',
		threshold: 0
	})
	return {
		observer, isVisible
	}
}