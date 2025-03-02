const { 
    createDiaryEntry, 
    getAllDiaryEntries, 
    getDiaryEntryById, 
    updateDiaryEntry, 
    deleteDiaryEntry 
  } = require("../controllers/diaryController");
  const DiaryEntry = require("../model/DiaryEntry");
  
  jest.mock("../model/DiaryEntry", () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  }));
  
  describe("Diary Controller", () => {
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
  
    it("should create a new diary entry", async () => {
      const req = { 
        body: { 
          selectedDate: "2025-02-06", 
          dayQuality: "Good", 
          thoughts: "Had a great day!", 
          highlight: "Went to a park" 
        } 
      };
      const res = mockResponse();
  
      DiaryEntry.create.mockResolvedValue({ id: 1, ...req.body });
  
      await createDiaryEntry(req, res);
  
      expect(DiaryEntry.create).toHaveBeenCalledWith(expect.objectContaining(req.body));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Diary entry created successfully" }));
    });
  
    it("should return an error if required fields are missing", async () => {
      const req = { body: { selectedDate: "2025-02-06", dayQuality: "Good" } }; 
      const res = mockResponse();
  
      await createDiaryEntry(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Please provide all required fields" });
    });
  
    it("should fetch all diary entries", async () => {
      const req = {};
      const res = mockResponse();
      const mockEntries = [
        { id: 1, selectedDate: "2025-02-05", dayQuality: "Good", thoughts: "Nice day" },
        { id: 2, selectedDate: "2025-02-06", dayQuality: "Bad", thoughts: "Tough day" },
      ];
  
      DiaryEntry.findAll.mockResolvedValue(mockEntries);
  
      await getAllDiaryEntries(req, res);
  
      expect(DiaryEntry.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEntries);
    });
  
    it("should fetch a diary entry by ID", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();
      const mockEntry = { id: 1, selectedDate: "2025-02-05", dayQuality: "Good", thoughts: "Great day!" };
  
      DiaryEntry.findByPk.mockResolvedValue(mockEntry);
  
      await getDiaryEntryById(req, res);
  
      expect(DiaryEntry.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEntry);
    });
  
    it("should return an error if diary entry is not found", async () => {
      const req = { params: { id: 999 } };
      const res = mockResponse();
  
      DiaryEntry.findByPk.mockResolvedValue(null);
  
      await getDiaryEntryById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Diary entry not found" });
    });
  
    it("should update a diary entry", async () => {
      const req = { 
        params: { id: 1 }, 
        body: { selectedDate: "2025-02-07", dayQuality: "Excellent", thoughts: "Awesome day!" } 
      };
      const res = mockResponse();
      
      const mockEntry = { id: 1, selectedDate: "2025-02-05", dayQuality: "Good", thoughts: "Nice day", update: jest.fn() };
  
      DiaryEntry.findByPk.mockResolvedValue(mockEntry);
      mockEntry.update.mockResolvedValue({ ...mockEntry, ...req.body });
  
      await updateDiaryEntry(req, res);
  
      expect(DiaryEntry.findByPk).toHaveBeenCalledWith(1);
      expect(mockEntry.update).toHaveBeenCalledWith(expect.objectContaining(req.body));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Diary entry updated successfully" }));
    });
  
    it("should return an error if diary entry is not found during update", async () => {
      const req = { params: { id: 999 }, body: { thoughts: "Updated thoughts" } };
      const res = mockResponse();
  
      DiaryEntry.findByPk.mockResolvedValue(null);
  
      await updateDiaryEntry(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Diary entry not found" });
    });
  
    it("should delete a diary entry", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();
  
      const mockEntry = { id: 1, destroy: jest.fn() };
      DiaryEntry.findByPk.mockResolvedValue(mockEntry);
      mockEntry.destroy.mockResolvedValue();
  
      await deleteDiaryEntry(req, res);
  
      expect(DiaryEntry.findByPk).toHaveBeenCalledWith(1);
      expect(mockEntry.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Diary entry deleted successfully" });
    });
  
    it("should return an error if diary entry is not found during delete", async () => {
      const req = { params: { id: 999 } };
      const res = mockResponse();
  
      DiaryEntry.findByPk.mockResolvedValue(null);
  
      await deleteDiaryEntry(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Diary entry not found" });
    });
  });
  