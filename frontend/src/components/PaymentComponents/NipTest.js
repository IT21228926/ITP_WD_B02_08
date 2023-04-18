import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddTeacherSalaryForm() {


    const [formData, setFormData] = useState({
        commissionPercentage: '',
        salaryData: [],
        total: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    };

    const handleSalaryDataChange = (e, index) => {
        const { name, value } = e.target;
        const newSalaryData = [...formData.salaryData];
        newSalaryData[index][name] = value;
        setFormData(prevFormData => ({ ...prevFormData, salaryData: newSalaryData }));
    };

    const handleAddSalaryData = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            salaryData: [...prevFormData.salaryData, { grade: '', month: '', subjectAmount: '', paymentCount: '' }]
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9090/api/salary/teacherSalary', formData);
            alert('Teacher salary data added successfully');
        } catch (err) {
            console.error(err);
            alert('Error adding teacher salary data');
        }
        console.log(formData)
    };

    //get data
    const [teacherSalaries, setTeacherSalaries] = useState([]);

    useEffect(() => {
        async function fetchTeacherSalaries() {
            const response = await fetch('/api/salary/teachersalary');
            const data = await response.json();
            setTeacherSalaries(data);
        }
        fetchTeacherSalaries();
    }, []);

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="commissionPercentage">Commission Percentage:</label>
                    <input
                        type="number"
                        id="commissionPercentage"
                        name="commissionPercentage"
                        value={formData.commissionPercentage}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Salary Data:</label>
                    <button type="button" onClick={handleAddSalaryData}>Add Salary Data</button>
                    {formData.salaryData.map((salary, index) => (
                        <div key={index}>
                            <label htmlFor={`grade-${index}`}>Grade:</label>
                            <input
                                type="number"
                                id={`grade-${index}`}
                                name="grade"
                                value={salary.grade}
                                onChange={(e) => handleSalaryDataChange(e, index)}
                                required
                            />
                            <label htmlFor={`month-${index}`}>Month:</label>
                            <input
                                type="text"
                                id={`month-${index}`}
                                name="month"
                                value={salary.month}
                                onChange={(e) => handleSalaryDataChange(e, index)}
                                required
                            />
                            <label htmlFor={`subjectAmount-${index}`}>Subject Amount:</label>
                            <input
                                type="number"
                                id={`subjectAmount-${index}`}
                                name="subjectAmount"
                                value={salary.subjectAmount}
                                onChange={(e) => handleSalaryDataChange(e, index)}
                                required
                            />
                            <label htmlFor={`paymentCount-${index}`}>Payment Count:</label>
                            <input
                                type="number"
                                id={`paymentCount-${index}`}
                                name="paymentCount"
                                value={salary.paymentCount}
                                onChange={(e) => handleSalaryDataChange(e, index)}
                                required
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <label htmlFor="total">Total:</label>
                    <input
                        type="number"
                        id="total"
                        name="total"
                        value={formData.total}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type='submit'>SUBMIT</button>
            </form>
            <div>
                <h2>All Teacher Salaries</h2>
                <table>
                    <thead>
                        <tr>
                            <th className='border border-black'>Commission Percentage</th>
                            <th className='border border-black'>Total Salary</th>
                            <th className='border border-black'>Net Total Salary</th>
                            <th className='border border-black'>Salary Entries</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teacherSalaries.map(teacherSalary => (
                            <tr key={teacherSalary._id}>
                                <td className='border border-black'>{teacherSalary.commissionPercentage}</td>
                                <td className='border border-black'>{teacherSalary.total}</td>
                                <td className='border border-black'>{teacherSalary.netTotal || 'N/A'}</td>
                                <td className='border border-black'>
                                    <ul>
                                        {teacherSalary.salaryData.map(salaryEntry => (
                                            <li key={`${salaryEntry.grade}-${salaryEntry.month}`}>
                                                Grade {salaryEntry.grade} - {salaryEntry.month}: {salaryEntry.subjectAmount} ({salaryEntry.paymentCount} payments)
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}