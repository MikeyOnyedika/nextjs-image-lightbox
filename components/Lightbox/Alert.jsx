import { AlertWrapper, Message, Bar } from './styles.module.css'

export const Alert = ({ message, className }) => {
    return (
        <div className={`${AlertWrapper} ${className}`}>
            <div className={Bar}></div>
            <p className={Message}>{message}</p>
        </div>
    )
}