const { clearanceReportService } = require("../services/reports.service")

exports.clearanceReport = async (req, res) => {
    const result = await clearanceReportService()
}