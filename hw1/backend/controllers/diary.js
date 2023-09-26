import DiaryModel from "../models/diaryModel.js";

export const getDiarys = async (req, res) => {
    try {
        const diarys = await DiaryModel.find({});
        return res.status(200).json(diarys);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createDiary = async (req, res) => {
    const { date, tag, mood, content } = req.body;

    if(!date || !tag || !mood || !content) {
        return res.status(400).json({ message: "Something is required!" });
    }
    try {
        const newDiary = await DiaryModel.create({
            date,
            tag,
            mood,
            content,
        });
        return res.status(201).json(newDiary);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateDiary = async (req ,res) => {
  const { id } = req.params;
  const { date, tag, mood, content } = req.body;

  try {
    const existedDiary = await DiaryModel.findById(id);
    if (!existedDiary) {
        return res.status(404).json({ message: "Diary not found!" });
    }

    if (date !== undefined) existedDiary.date = date;
    if (tag !== undefined) existedDiary.tag = tag;
    if (mood !== undefined) existedDiary.mood = mood;
    if (content !== undefined) existedDiary.content = content;

    await existedDiary.save();

    existedDiary.id = existedDiary._id;
    delete existedDiary._id;

    return res.status(200).json(existedDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
