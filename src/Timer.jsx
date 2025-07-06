import { useEffect } from "react"


export function Timer({ isActive, timeUp, timeLeft, setTimeLeft }) {
    // TIMER COUNTDOWN
    useEffect(() => {
        let interval = null
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    const newTime = prev - 1
                    if (newTime === 0) {
                        timeUp()
                    }
                    return newTime
                })
            }, 1000)
        }
        return (() => clearInterval(interval))
    }, [isActive, timeLeft, timeUp])

    // TIMER DISPLAY
    const displayTime = seconds => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60

        return `${mins}: ${secs.toString().padStart(2, '0')}`
    }


    return (
        <section className="timer">
            <p>Time Left: {displayTime(timeLeft)}</p>
        </section>
    )
}






































// export function Timer({ isActive, timeLeft, setTimeLeft, onTimeUp }) {
    
//     useEffect(() => {
//         let interval = null
//         if (isActive && timeLeft > 0) {
//             interval = setInterval(() => {
//                 setTimeLeft(prev => {
//                     const newTime = prev - 1
//                     if (newTime === 0) {
//                         onTimeUp()
//                     }
//                     return newTime
//                 })
//             }, 1000)
//         } 
//         return (() => clearInterval(interval))
//     }, [isActive, timeLeft, onTimeUp])

//     const formatTime = seconds => {
//         const mins = Math.floor(seconds / 60)
//         const secs = seconds % 60

//         return `${mins}: ${secs.toString().padStart(2, `0`)}`
//     }

//     return (
//         <section className="timer">
//             <p>Time left: {formatTime(timeLeft)}</p>
//         </section>
//     )

// }