import DatePicker, {registerLocale} from "react-datepicker";
import './style.scss';
import moment from "moment";
import axiosInstance from "../../service/api";

import "react-datepicker/dist/react-datepicker.css";
import { useState, forwardRef} from "react";
import { enUS } from "date-fns/locale";
import { FaCalendarAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const customLocale = {
    ...enUS, // Extend the base locale (e.g., enUS)
    localize: {
      ...enUS.localize,
      day: (n) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'][n] // Custom day names
    }
  };

  registerLocale("custom", customLocale);

const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="custom-date-input" onClick={onClick} ref={ref}>
        {
            value ? 
            <div>
                <div className="placeholder-text"><FaCalendarAlt style={{marginRight:'6px'}}/>Date <IoIosArrowDown style={{marginLeft:'6px'}}/></div>
                <div className="selected-date">{value}</div>
            </div> : 
            <div className="placeholder-text"><FaCalendarAlt style={{marginRight:'6px'}}/>Select a Date <IoIosArrowDown style={{marginLeft:'6px'}}/></div>
        }
    </button>
));
  

const DateTime = ({disabled, blogId, setShowSuccess, setIsScheduled}) => {

    const [startDate, setStartDate] = useState(null);
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);

    const formattedDate = (date) => {
        return  moment(date).format('DD MMMM YYYY'); // Example: "19 September 2024"
    }

    const scheduleBlog = async () => {
        setIsScheduled(true);
        const payload = {
            scheduledPublishDate: formattedDate(startDate)
        }
        try {
          const response = await axiosInstance.put(`/api/blog/${blogId}/schedule`, payload);
          console.log('Blog published:', response.data);
          setShowSuccess(true)
        } catch (error) {
          console.error('Error publishing the blog:', error);
        }
    }

    return(
        <div className="date-time-wrapper">
            <p>Choose a date in the future you want your story to be published.</p>
            <DatePicker 
                selected={(startDate)} 
                onChange={(date) => formattedDate(setStartDate(date))} 
                placeholderText={"Please select a date"} 
                 dateFormat="dd MMMM, yy"
                 minDate={nextDate}
                customInput={<CustomInput />} // Use custom input component
                locale="custom" 
            />
            <button className="schedule-cta" disabled={disabled || !startDate} onClick={() => scheduleBlog()}>Schedule for later</button>

        </div>
    )
}

export default DateTime;