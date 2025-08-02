import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { LuCalendarMinus2 } from "react-icons/lu";

interface CalenderProps {
    date: Date | null
    onDateChange: (date: Date | null) => void
    hasError?: boolean
}

function Calender({date, onDateChange, hasError = false}: CalenderProps) {
    const baseClasses = "border-2 rounded-[8px] py-2 pl-2 caret-transparent text-center font-bold"
    const conditionalClasses = hasError 
        ? "border-red-500 focus:outline-red-500" 
        : "focus:outline-lime-500"

    return (
        <div className="flex relative mb-2">
            <DatePicker 
                selected={date}
                onChange={onDateChange}
                className={`${baseClasses} ${conditionalClasses}`}
                placeholderText="YYYY-MM-DD"
                dateFormat={"yyyy-MM-dd"}
            />
            <LuCalendarMinus2 size={32} className="absolute top-1 left-2"/>
        </div>
    )
}

export default Calender