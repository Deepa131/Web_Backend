const Favorite = require('../model/FavoriteDay');
const DiaryEntry = require('../model/DiaryEntry'); 

// Define the model relationships
Favorite.belongsTo(DiaryEntry, { foreignKey: 'diaryId' });
DiaryEntry.hasMany(Favorite, { foreignKey: 'diaryId' });

// Add a new favorite entry
const addFavorite = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: Missing user data" });
        }

        const userId = req.user.id;
        const { diaryId } = req.body;

        if (!diaryId) {
            return res.status(400).json({ error: 'Diary ID is required' });
        }

        const newFavorite = await Favorite.create({ userId, diaryId });
        res.status(201).json({ message: 'Favorite added successfully', newFavorite });
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ error: 'Something went wrong while adding the favorite' });
    }
};

// Get all favorite entries for the logged-in user
const getFavorites = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: Missing user data" });
        }

        const userId = req.user.id;
        // console.log("User ID from token:", userId); // Debugging

        const favorites = await Favorite.findAll({
            where: { userId },
            include: [{ model: DiaryEntry }]
        });

        res.status(200).json(favorites);
    } catch (error) {
        console.error("Error retrieving favorites:", error);
        res.status(500).json({ error: 'Something went wrong while fetching favorites' });
    }
};

// Get a single favorite entry by ID
const getFavoriteById = async (req, res) => {
    try {
        const { id } = req.params;
        const favorite = await Favorite.findByPk(id, {
            include: [{ model: DiaryEntry }]
        });

        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.status(200).json(favorite);
    } catch (error) {
        console.error("Error retrieving favorite:", error);
        res.status(500).json({ error: 'Something went wrong while fetching the favorite' });
    }
};

// Update a favorite entry
const updateFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const { diaryId } = req.body;

        if (!id || !diaryId) {
            return res.status(400).json({ error: 'Invalid request parameters' });
        }

        const favorite = await Favorite.findByPk(id);

        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        await favorite.update({ diaryId });
        res.status(200).json({ message: 'Favorite updated successfully', favorite });
    } catch (error) {
        console.error("Error updating favorite:", error);
        res.status(500).json({ error: 'Something went wrong while updating the favorite' });
    }
};

// Remove a favorite entry
const removeFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const favorite = await Favorite.findByPk(id);

        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        await favorite.destroy();
        res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ error: 'Something went wrong while removing the favorite' });
    }
};

// Toggle favorite entry (Add/Remove)
// const toggleFavorite = async (req, res) => {
//     try {
//         const userId = req.user.id; 
//         const { diaryId } = req.body; // Extract diaryId from request body

//         if (!diaryId) {
//             return res.status(400).json({ error: 'Diary ID is required' });
//         }

//         // Check if the entry is already a favorite
//         const existingFavorite = await Favorite.findOne({ where: { userId, diaryId } });

//         if (existingFavorite) {
//             await existingFavorite.destroy();
//             return res.status(200).json({ message: 'Favorite removed successfully' });
//         } else {
//             const newFavorite = await Favorite.create({ userId, diaryId });
//             return res.status(201).json({ message: 'Favorite added successfully', newFavorite });
//         }
//     } catch (error) {
//         console.error("Error toggling favorite:", error);
//         res.status(500).json({ error: 'Something went wrong while toggling the favorite' });
//     }
// };

const toggleFavorite = async (req, res) => {
    try {
      const { diaryId } = req.body;
      if (!diaryId) {
        return res.status(400).json({ error: "Diary ID is required" });
      }
  
      // Find diary entry
      let diary = await Diary.findByPk(diaryId);
      if (!diary) {
        return res.status(404).json({ error: "Diary entry not found" });
      }
  
      // Toggle favorite status
      diary.isFavorite = !diary.isFavorite;
      await diary.save();
  
      // Return the full updated diary entry
      return res.json(diary);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      res.status(500).json({ error: "Server error while toggling favorite" });
    }
  };
  

module.exports = {
    addFavorite,
    getFavorites,
    getFavoriteById,
    updateFavorite,
    removeFavorite,
    toggleFavorite,
};
