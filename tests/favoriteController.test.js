const { 
    addFavorite, 
    getFavorites, 
    getFavoriteById, 
    updateFavorite, 
    removeFavorite, 
    toggleFavorite 
  } = require("../controllers/favoriteController");
  const Favorite = require("../model/FavoriteDay");
  const DiaryEntry = require("../model/DiaryEntry");
  
  jest.mock("../model/FavoriteDay", () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
  }));
  
  jest.mock("../model/DiaryEntry", () => ({
    findByPk: jest.fn(),
  }));
  
  describe("Favorite Controller", () => {
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
  
    it("should add a favorite entry", async () => {
      const req = { user: { id: 1 }, body: { diaryId: 2 } };
      const res = mockResponse();
      const mockFavorite = { id: 1, userId: 1, diaryId: 2 };
  
      Favorite.create.mockResolvedValue(mockFavorite);
  
      await addFavorite(req, res);
  
      expect(Favorite.create).toHaveBeenCalledWith({ userId: 1, diaryId: 2 });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "Favorite added successfully", newFavorite: mockFavorite });
    });
  
    it("should return an error if user is missing in addFavorite", async () => {
      const req = { body: { diaryId: 2 } };
      const res = mockResponse();
  
      await addFavorite(req, res);
  
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized: Missing user data" });
    });
  
    it("should return all favorites for a user", async () => {
      const req = { user: { id: 1 } };
      const res = mockResponse();
      const mockFavorites = [
        { id: 1, userId: 1, diaryId: 2 },
        { id: 2, userId: 1, diaryId: 3 },
      ];
  
      Favorite.findAll.mockResolvedValue(mockFavorites);
  
      await getFavorites(req, res);
  
      expect(Favorite.findAll).toHaveBeenCalledWith({ where: { userId: 1 }, include: [{ model: DiaryEntry }] });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFavorites);
    });
  
    it("should return a single favorite entry by ID", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();
      const mockFavorite = { id: 1, diaryId: 2, DiaryEntry: {} };
  
      Favorite.findByPk.mockResolvedValue(mockFavorite);
  
      await getFavoriteById(req, res);
  
      expect(Favorite.findByPk).toHaveBeenCalledWith(1, { include: [{ model: DiaryEntry }] });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFavorite);
    });
  
    it("should return an error if favorite is not found by ID", async () => {
      const req = { params: { id: 999 } };
      const res = mockResponse();
  
      Favorite.findByPk.mockResolvedValue(null);
  
      await getFavoriteById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Favorite not found" });
    });
  
    it("should update a favorite entry", async () => {
      const req = { params: { id: 1 }, body: { diaryId: 3 } };
      const res = mockResponse();
      const mockFavorite = { id: 1, diaryId: 2, update: jest.fn() };
  
      Favorite.findByPk.mockResolvedValue(mockFavorite);
      mockFavorite.update.mockResolvedValue({ ...mockFavorite, diaryId: 3 });
  
      await updateFavorite(req, res);
  
      expect(Favorite.findByPk).toHaveBeenCalledWith(1);
      expect(mockFavorite.update).toHaveBeenCalledWith({ diaryId: 3 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Favorite updated successfully", favorite: mockFavorite });
    });
  
    it("should return an error if favorite is not found during update", async () => {
      const req = { params: { id: 999 }, body: { diaryId: 3 } };
      const res = mockResponse();
  
      Favorite.findByPk.mockResolvedValue(null);
  
      await updateFavorite(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Favorite not found" });
    });
  
    it("should remove a favorite entry", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();
      const mockFavorite = { id: 1, destroy: jest.fn() };
  
      Favorite.findByPk.mockResolvedValue(mockFavorite);
      mockFavorite.destroy.mockResolvedValue();
  
      await removeFavorite(req, res);
  
      expect(Favorite.findByPk).toHaveBeenCalledWith(1);
      expect(mockFavorite.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Favorite removed successfully" });
    });
  
    it("should return an error if favorite is not found during delete", async () => {
      const req = { params: { id: 999 } };
      const res = mockResponse();
  
      Favorite.findByPk.mockResolvedValue(null);
  
      await removeFavorite(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Favorite not found" });
    });
  
    it("should toggle a favorite entry", async () => {
      const req = { body: { diaryId: 2 } };
      const res = mockResponse();
      const mockDiary = { id: 2, isFavorite: false, save: jest.fn() };
  
      DiaryEntry.findByPk.mockResolvedValue(mockDiary);
      mockDiary.save.mockResolvedValue({ ...mockDiary, isFavorite: true });
  
      await toggleFavorite(req, res);
  
      expect(DiaryEntry.findByPk).toHaveBeenCalledWith(2);
      expect(mockDiary.isFavorite).toBe(true);
      expect(mockDiary.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockDiary);
    });
  
    it("should return an error if diary entry is not found in toggleFavorite", async () => {
      const req = { body: { diaryId: 999 } };
      const res = mockResponse();
  
      DiaryEntry.findByPk.mockResolvedValue(null);
  
      await toggleFavorite(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Diary entry not found" });
    });
  });
  