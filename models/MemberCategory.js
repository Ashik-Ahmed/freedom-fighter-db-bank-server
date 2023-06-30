const { default: mongoose } = require("mongoose");

const memberCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    photo: {
        type: String,
    },
    priorityCriterias: [{
        label: String,
        value: String
    }],
},
    {
        timestamps: true
    }
)


const MemberCategory = mongoose.model('MemberCategory', memberCategorySchema)
module.exports = MemberCategory;