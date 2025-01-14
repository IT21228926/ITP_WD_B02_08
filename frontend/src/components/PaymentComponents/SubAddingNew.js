import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';


function AddSubjectForm() {
  const [subjectName, setSubjectName] = useState('');
  const [subjectAmount, setSubjectAmount] = useState('');
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedTeacherName, setSelectedTeacherName] = useState('');
  const [subjectAdded, setSubjectAdded] = useState(false);

  useEffect(() => {
    // Load all teachers and set them as options in the dropdown
    axios.get('/api/teasub/alltt')
      .then(response => {
        const teachers = response.data;
        const options = teachers.map(teacher => ({ value: teacher._id, label: `${teacher.firstName} ${teacher.lastName}` }));
        setTeacherOptions(options);
        console.log(options)
      })
      .catch(error => console.log(error));
  }, []);

  const handleTeacherChange = selectedOption => {
    // When a teacher is selected, set their ID as the selectedTeacherId state
    setSelectedTeacherId(selectedOption.value);
    setSelectedTeacherName(selectedOption.label);
    console.log(selectedOption.label)
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Create a new subject with the entered details and the selected teacher ID
    const newSubject = {
      subjectName,
      subjectAmount,
      subjectTeacherID: selectedTeacherId,
      subjectTeacherName: selectedTeacherName
    };
    // Send a POST request to the server to add the new subject
    axios.post('/api/subject/add', newSubject)
      .then(response => {
        setSubjectName('');
        setSubjectAmount('');
        setSelectedTeacherId('');
        setSubjectAdded(true);
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      {subjectAdded ? (
        <p>Subject added successfully!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Subject name:
            <input type="text" value={subjectName} onChange={event => setSubjectName(event.target.value)} />
          </label>
          <label>
            Subject amount:
            <input type="number" value={subjectAmount} onChange={event => setSubjectAmount(event.target.value)} />
          </label>
          <label className=''>
            Subject teacher:
            <Select options={teacherOptions} onChange={handleTeacherChange} />
          </label>
          <button type="submit">Add subject</button>
        </form>
      )}
    </div>
  );
}

export default AddSubjectForm;