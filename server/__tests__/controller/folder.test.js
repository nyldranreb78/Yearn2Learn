const { index, create, show, update, remove } = require('../../controllers/folderController');
const User = require('../../models/user');
const Note = require('../../models/note');
const Folder = require('../../models/folder');
const auth = require('../../middleware/auth-service');
const Flashcards = require('../../models/flashcards');

jest.mock('../../models/user');
jest.mock('../../models/note');
jest.mock('../../models/folder');
jest.mock('../../middleware/auth-service');

describe('index', () => {
    let req, res;

    beforeEach(() => {
        req = { };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should return 401 if ID is not valid', async () => {
        const mockID = undefined;
        auth.getUserID = jest.fn().mockReturnValue(mockID);

        await index(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized: Invalid token" });
    });

    it('should return 200 and all folders of that user', async () => {
        const mockID = "validID";
        auth.getUserID = jest.fn().mockReturnValue(mockID);
        const mockFolders = [{ name: "folder1" }, { name: "folder2" }];
        Folder.find = jest.fn().mockResolvedValue(mockFolders);

        await index(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ folders: mockFolders });
    });

    it('should return 500 if error occurs', async () => {
        const mockID = "validID";
        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.find = jest.fn().mockRejectedValue(new Error('error message'));

        await index(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'error message' });
    });
});

describe('create', () => {
    let req, res;

    beforeEach(() => {
        req = { 
            body: {
                name: "folder1",
                priority: true
            } 
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should return 401 if ID is not valid', async () => {
        const mockID = undefined;

        auth.getUserID = jest.fn().mockReturnValue(mockID);

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized: Invalid token" });
    });

    it('should return 500 if user is not found', async () => {
        const mockID = "validID";

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        User.findOne = jest.fn().mockResolvedValue(null);

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 201 and the created folder', async () => {
        const mockID = "validID";
        const mockFolder = { name: "folder1", save: jest.fn().mockResolvedValue() };

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        User.findOne = jest.fn().mockResolvedValue({ _id: "userID" });
        Folder.mockImplementation(() => mockFolder);

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ folder: mockFolder });
    });

    it('should return 500 if error occurs', async () => {
        const mockID = "validID";
        auth.getUserID = jest.fn().mockReturnValue(mockID);
        User.findOne = jest.fn().mockRejectedValue(new Error('error message'));

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'error message' });
    });
});

describe('show', () => {
    let req, res;

    beforeEach(() => {
        req = { 
            params: { 
                id: "folderID" 
            } 
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should return 401 if ID is not valid', async () => {
        const mockID = undefined;

        auth.getUserID = jest.fn().mockReturnValue(mockID);

        await show(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized: Invalid token" });
    });

    it('should return 404 if folder is not found', async () => {
        const mockID = "validID";

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockResolvedValue(null);

        await show(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Folder not found' });
    });

    it('should return 403 if user is not the author of the folder', async () => {
        const mockID = "validID";
        const mockFolder = { author: "otherID" };

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockResolvedValue(mockFolder);

        await show(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return 200 and the folder', async () => {
        const mockID = "validID";
        const mockFolder = { author: "validID" };

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockResolvedValue(mockFolder);

        await show(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ folder: mockFolder });
    });

    it('should handle error', async () => {
        const mockID = "validID";
        const mockError = new Error('error message');

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockRejectedValue(mockError);

        await show(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
});

describe('update', () => { 
    let req, res;

    beforeEach(() => {
        req = { 
            params: { 
                id: "folderID" 
            },
            body: {
                name: "folder1",
                priority: true
            } 
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should return 401 if ID is not valid', async () => {
        const mockID = undefined;

        auth.getUserID = jest.fn().mockReturnValue(mockID);

        await update(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized: Invalid token" });
    });

    it('should return 404 if folder is not found', async () => {
        const mockID = "validID";

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockResolvedValue(null);

        await update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Folder not found' });
    });

    it('should return 403 if user is not the author of the folder', async () => {
        const mockID = "validID";
        const mockFolder = { author: "otherID" };

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockResolvedValue(mockFolder);

        await update(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return 200 and the updated folder if all conditions are met', async () => {
        const mockID = "validID";
        const mockFolder = { author: "validID", save: jest.fn().mockResolvedValue() };

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockResolvedValue(mockFolder);

        await update(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ folder: mockFolder });
    });

    it('should handle error', async () => {
        const mockID = "validID";
        const mockError = new Error('error message');

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockRejectedValue(mockError);

        await update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
});

describe('remove', () => {
    let res, req;

    beforeEach(() => {
        req = {
            params: {
                id: "folderID"
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should return 401 if ID is not valid', async () => {
        const mockID = undefined;
        auth.getUserID = jest.fn().mockReturnValue(mockID);

        await remove(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized: Invalid token" });
    });

    it('should return 404 if folder is not found', async () => {
        const mockID = "validID";
        const mockFolder = undefined;

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockResolvedValue(mockFolder);

        await remove(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Folder not found' });
    });

    it('should return 403 if the user is not the author of the folder', async () => {
        const mockID = "validID";
        const mockFolder = { author: "otherID" };

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockResolvedValue(mockFolder);

        await remove(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return 200 and the deleted folder if all conditions are met', async () => {
        const mockID = "validID";
        const mockFolder = {_id: "folderID", author: "validID", notes: ["note1", "note2"], flashcards: ["flashcard1"] };
        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockResolvedValue(mockFolder);
        Note.deleteMany = jest.fn().mockResolvedValue({deletedCount: 2});
        Flashcards.deleteMany = jest.fn().mockResolvedValue({deletedCount: 1});
        mockFolder.deleteOne = jest.fn().mockResolvedValue({deletedCound: 1});

        await remove(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Folder deleted' });
    });

    it('should handle error', async () => { 
        const mockID = "validID";
        const mockError = new Error('error message');

        auth.getUserID = jest.fn().mockReturnValue(mockID);
        Folder.findOne = jest.fn().mockRejectedValue(mockError);

        await remove(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    });
});