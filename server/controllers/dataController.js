const DataSet = require("../models/DataSet");

exports.saveChartMeta = async (req, res) => {
  const { title, chartType, dataset, datasetId } = req.body;
  const uploadedBy = req.user?.id;

  if (!uploadedBy) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title || !chartType || !datasetId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existing = await DataSet.findById(datasetId);

    if (!existing) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    const updated = await DataSet.findByIdAndUpdate(
      datasetId,
      {
        filename: title,
        chartType,
        dataset,
        uploadedBy,
        uploadedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(500).json({ message: "Failed to update dataset" });
    }

    res.status(200).json({
      _id: updated._id,
      filename: updated.filename,
      chartType: updated.chartType,
      uploadedAt: updated.uploadedAt,
      message: "Chart metadata saved successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to save chart" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const uploadedBy = req.user?.id;
    if (!uploadedBy) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userFilter = { uploadedBy };
    const chartFilter = { uploadedBy, chartType: { $ne: null } };

    const totalFiles = await DataSet.countDocuments(userFilter);
    const chartTypes = await DataSet.distinct("chartType", chartFilter);

    const recentUploads = await DataSet.find(userFilter)
      .sort({ uploadedAt: -1 })
      .limit(5)
      .select("_id filename chartType uploadedAt");

    res.status(200).json({
      totalFiles,
      uniqueChartTypes: chartTypes.length,
      recentUploads,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

exports.getAllData = async (req, res) => {
  try {
    const datasets = await DataSet.find({})
      .sort({ uploadedAt: -1 })
      .select("_id filename chartType uploadedAt");

    res.status(200).json(datasets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chart history" });
  }
};
