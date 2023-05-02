import { useState } from 'react'

export function useImageZoom() {
    // zoom level ---- 0.4x 0.6x 0.8x 1x 1.2x 1.4x 1.6x 1.8x 2.0x
    const [currentZoomLevel, setCurrentZoomLevel] = useState(1)
    const maxZoomInLevel = 2.4
    const maxZoomOutLevel = 0.4
    const delta = 0.2

    function zoomIn() {
        setCurrentZoomLevel(
            prev => {
                if (prev === maxZoomInLevel) {
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
        normalizeZoom,
    }

}