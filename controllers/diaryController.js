const DiaryEntry = require('../model/DiaryEntry');

// Create a new diary entry
const createDiaryEntry = async (req, res) => {
  try {
    const { selectedDate, dayQuality, thoughts, highlight } = req.body;

    // Validate required fields
    if (!selectedDate || !dayQuality || !thoughts) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const entry = await DiaryEntry.create({
      selectedDate,
      dayQuality,
      thoughts,
      highlight: highlight || null,
    });

    res.status(201).json({ message: 'Diary entry created successfully', entry });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while creating the diary entry' });
  }
};

// Get all diary entries
const getAllDiaryEntries = async (req, res) => {
  try {
    const entries = await DiaryEntry.findAll();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching diary entries' });
  }
};

// Get a single diary entry by ID
const getDiaryEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await DiaryEntry.findByPk(id);

    if (!entry) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching the diary entry' });
  }
};

// Update a diary entry
const updateDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params; // Ensure the 'id' is being passed correctly from the URL
    const { selectedDate, dayQuality, thoughts, highlight } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'No entry ID provided' });
    }

    const entry = await DiaryEntry.findByPk(id);

    if (!entry) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }

    await entry.update({
      selectedDate,
      dayQuality,
      thoughts,
      highlight: highlight || entry.highlight,
    });

    res.status(200).json({ message: 'Diary entry updated successfully', entry });
  } catch (error) {
    console.error("Error updating entry:", error);
    res.status(500).json({ error: 'Something went wrong while updating the diary entry' });
  }
};

// Delete a diary entry
const deleteDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await DiaryEntry.findByPk(id);

    if (!entry) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }

    await entry.destroy();
    res.status(200).json({ message: 'Diary entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while deleting the diary entry' });
  }
};

module.exports = { createDiaryEntry, getAllDiaryEntries, getDiaryEntryById, updateDiaryEntry, deleteDiaryEntry };
