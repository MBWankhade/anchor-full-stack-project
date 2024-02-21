import React from 'react'
import {Link} from 'react-router-dom'
import {FiCalendar, FiDollarSign, FiMapPin,FiClock} from 'react-icons/fi'

const Card = ({data,coins,handleapplyJobs}) =>{
    const {
        "Company Name": companyName,
        "Role Name": jobTitle,
        "Company Logo": companyLogo,
        "CTC/Stipend": salaryRange,
        "Experience Required": experience,
        "tags": jobTags,
        "job_types": jobTypes,
        "_id": jobId
    } = data;

    


    return(
        <section className='card'>
  <div className='flex gap-4 flex-col sm:flex-row items-start'>
        {companyLogo.toLowerCase() !=='no logo' ? (
        <img src={companyLogo} alt={companyName} style={{ width: '138px', height: '60px' }} />
        ) : (
        <img src="https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg" alt="Default Logo" style={{ width: '138px', height: '60px' }} />
        )}
    <div>
      <h4 className='text-primary mb-1'>{companyName}</h4>
      <h3 className='text-lg font-semibold mb-2'>{jobTitle}</h3>

      <div className='text-primary/70 text-base flex flex-wrap gap-2 mb-2'>
        <span className='flex items-center gap-2'><FiDollarSign/>{salaryRange}</span>
        <span className='flex items-center gap-2'><FiCalendar/>{experience}</span>
      </div>

      {/* <p className='text-base text-primary/70 '>{description}</p> */}
      
      <div>
        <button className='bg-blue text-white px-4 py-2 rounded-full hover:bg-primary-dark transition duration-300' onClick={handleapplyJobs}>
            Apply Now
        </button>
      </div>
    </div>
  </div>
</section>
    )
}

export default Card;