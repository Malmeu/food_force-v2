const express = require('express');
const { 
  getJobs, 
  getJob, 
  createJob, 
  updateJob, 
  deleteJob, 
  getJobsInRadius,
  getEmployerJobs
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, createJob);

router.route('/employer')
  .get(protect, getEmployerJobs);

router.route('/radius/:city/:distance')
  .get(getJobsInRadius);

router.route('/:id')
  .get(getJob)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;
