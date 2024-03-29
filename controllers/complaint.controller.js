const { addNewComplaintService, getAllComplaintsService, updateComplaintFeedbackService, updateComplaintStatusService } = require("../services/complaint.service");

exports.addNewComplaint = async (req, res) => {
    try {
        const { id } = req.params
        // console.log(id, req.body);
        const result = await addNewComplaintService({ id, issueData: req.body })
        if (result.modifiedCount) {
            return res.status(200).json({
                status: 'Success',
                message: 'Successfully Registered Complaint',
            })
        }
        else {
            return res.status(500).json({
                status: 'Failed',
                error: "Failed to Register. Please try again",
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.getAllComplaints = async (req, res) => {
    try {
        const { id } = req.params
        // console.log(id, req.body);
        const result = await getAllComplaintsService(id)

        res.status(200).json({
            status: 'Success',
            data: result,
        })

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}


exports.updateComplaint = async (req, res) => {
    try {
        const { complaintId, feedback, status } = req.body
        // console.log(id, complaintId, feedback);
        if (feedback) {
            var result = await updateComplaintFeedbackService({ complaintId, feedback })
        }

        if (status) {
            var result = await updateComplaintStatusService({ complaintId, status });
        }

        res.status(200).json({
            status: 'Success',
            data: result,
        })

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}