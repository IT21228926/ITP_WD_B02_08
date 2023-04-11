import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


function MainTimetable() {

 const [classes, setClasses] = useState([]);
 const [activeGrade, setActiveGrade] = useState('6');
 const [selectedClass, setSelectedClass] = useState(null);

 //handle the grade click
 const handleGradeClick = (grade) => {
   setActiveGrade(grade);
 };

 //Grade buttons
 const gradeButtons = [
  { grade: '6', label: 'Grade 6' },
  { grade: '7', label: 'Grade 7' },
  { grade: '8', label: 'Grade 8' },
  { grade: '9', label: 'Grade 9' },
  { grade: '10', label: 'Grade 10' },
  { grade: '11', label: 'Grade 11' },
];

//set data of the selected class to render them to the register class page
 function handleClassClick(clz) {
  setSelectedClass({
    id: clz._id,
    grade: clz.grade,
    subject: clz.subject,
    teacher: clz.teacher,
    hall: clz.hall,
    date: clz.date,
    time: clz.time,
    fees: clz.fees
  });
}

// handle register button click event
const handleButtonClick = () => {

};

//Hide the register button when click outside
const ref = useRef(null);
const buttonRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setSelectedClass(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, buttonRef]);



 //Get all the class schedules (view the timetable)
 useEffect(() => {
   axios
     .get('http://localhost:9090/class/allClasses')
     .then((res) => {
       setClasses(res.data);
     })
     .catch((err) => {
       alert(err.message);
     });
 }, []);


return (
<div className="container my-5 ml-9" style={{ maxWidth: "1600px"}}>     
 {/*View timetable*/}
 <div class="col-11" >
 <h3 className="mb-4 text-center font-medium text-2xl text-gray-900 dark:text-white">Main Class Schedule</h3>
 <nav className="d-flex justify-content-center mb-4">
        <ul className="nav nav-pills">
        {gradeButtons.map((button) => (
            <li className="nav-item" key={button.grade}>
              <button
                className={`nav-link ${activeGrade === button.grade ? 'active' : ''}`}
                onClick={() => handleGradeClick(button.grade)}
              >
                {button.label}
              </button>
            </li>
          ))}
        </ul>
</nav>
 <div className="table-responsive">
   <table className="table table-striped table-hover" ref={ref}>
     <thead className="text-center">
       <tr>
         <th>Grade</th>
         <th>Subject</th>
         <th>Teacher</th>
         <th>Hall</th>
         <th>Date</th>
         <th>Time</th>
         <th>Fees</th>
       </tr>
     </thead>
     <tbody className="text-center">
       {classes
         .filter((clz) => clz.grade === activeGrade)
         .map((clz) => (
          <tr key={clz.id} onClick={() => handleClassClick(clz)}>
             <td>{clz.grade}</td>
             <td>{clz.subject}</td>
             <td>{clz.teacher}</td>
             <td>{clz.hall}</td>
             <td>{clz.date}</td>
             <td>{clz.time}</td>
             <td>Rs.{clz.fees}</td>
           </tr>
         ))}
     </tbody>
   </table>
   {selectedClass && (
        <button type="submit" className="ml-5 mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
        font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2.5 text-center"
        onClick={handleButtonClick}>Register</button>
   )}
 </div>
 </div>
 </div>
);

}

export default MainTimetable;