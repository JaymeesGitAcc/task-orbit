import mongoose from "mongoose"

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

const Card = mongoose.model("Card", cardSchema)

export default Card
