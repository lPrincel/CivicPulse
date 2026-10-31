const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Roads', 'Sanitation', 'Electricity', 'Water', 'Safety'],
        message: '{VALUE} is not a valid category'
      },
      default: 'Safety'
    },
    urgency: {
      type: String,
      required: [true, 'Urgency level is required'],
      enum: {
        values: ['Low', 'Medium', 'High', 'Emergency'],
        message: '{VALUE} is not a valid urgency level'
      },
      default: 'Medium'
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['Reported', 'In Progress', 'Resolved'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Reported'
    },
    aiSummary: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt automatically
  }
);

// Index for high-performance dashboard queries during demos
issueSchema.index({ status: 1, urgency: 1, createdAt: -1 });

module.exports = mongoose.model('Issue', issueSchema);

