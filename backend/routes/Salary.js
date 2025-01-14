const express = require('express');
const router = express.Router();
const TeacherSalary = require('../models/Salarys');

// Add teacher salary data
router.post('/teacherSalary', async (req, res) => {
    try {
        // const { commissionPercentage, salaryData, total, netTotal } = req.body;
        const { teacherID, teacherName, date, netTotal, commissionPercentage, total, otherCharges, otherChargesNote, salaryData, } = req.body;

        // Create a new instance of the TeacherSalary model
        const newTeacherSalary = new TeacherSalary({
            teacherID,
            teacherName,
            date,
            netTotal,
            commissionPercentage,
            total,
            otherCharges,
            otherChargesNote,
            salaryData,
        });

        // Save the new instance to the database
        await newTeacherSalary.save();

        res.status(201).json({ message: 'Teacher salary data added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding teacher salary data' });
    }
});


// GET route to retrieve all teacher salary entries
router.get('/teachersalary', async (req, res) => {
    try {
        const teacherSalaries = await TeacherSalary.find();
        res.json(teacherSalaries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//route for get payment count
router.get('/paymentcount', async (req, res) => {
    try {
        const { teacherName, grade, month, subject } = req.query;
        const result = await TeacherSalary.aggregate([
            { $match: { 'teacherName': teacherName } },
            { $unwind: '$salaryData' },
            { $match: { 'salaryData.grade': grade, 'salaryData.month': month, 'salaryData.subject': subject } },
            { $group: { _id: null, totalPaymentCount: { $sum: '$salaryData.paymentCount' } } }
        ]);
        const paymentCount = result.length ? result[0].totalPaymentCount : 0;
        res.send({ paymentCount });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
