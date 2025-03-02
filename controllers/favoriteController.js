const Favorite = require('../model/FavoriteDay');
const DiaryEntry = require('../model/DiaryEntry'); 

Favorite.belongsTo(DiaryEntry, { foreignKey: 'diaryId' });
DiaryEntry.hasMany(Favorite, { foreignKey: 'diaryId' });

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

const getFavorites = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: Missing user data" });
        }

        const userId = req.user.id;

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

const updateFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const { diaryId } = req.body;

        if (!id) {
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

const toggleFavorite = async (req, res) => {
    try {
      const { diaryId } = req.body;
      if (!diaryId) {
        return res.status(400).json({ error: "Diary ID is required" });
      }
  
      let diary = await Diary.findByPk(diaryId);
      if (!diary) {
        return res.status(404).json({ error: "Diary entry not found" });
      }
  
      diary.isFavorite = !diary.isFavorite;
      await diary.save();
  
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
