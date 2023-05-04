import { useState, useEffect } from "react"

export const useExpiringState = (initialValue, timeout = 2000) => {
    const [state, setState] = useState(initialValue)
    const [isExpired, setIsExpired] = useState(true)

    // after some time, clear the state
    useEffect(() => {
        let timeoutId

        if (isExpired === false) {
            // set the state to expired after timeout elapses
            timeoutId = setTimeout(() => {
                setIsExpired(true)
            }, timeout)
        }

        return () => {
            if (timeoutId != null) {
                clearTimeout(timeoutId)
            }
        }
    }, [isExpired])

    //basically, say the state is valid again
    function makeValidAgain() {
        console.log("respawned")
        setIsExpired(false)
    }

    return [
        state, setState, isExpired, makeValidAgain
    ]
}