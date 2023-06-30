const { clearanceReportService } = require("../services/reports.service")

exports.clearanceReport = async (req, res) => {
    try {
        console.log(req.query);
        const result = await clearanceReportService(req.query)
        // const result = await getReportService(req.query)

        res.status(200).json({
            status: 'Success',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}