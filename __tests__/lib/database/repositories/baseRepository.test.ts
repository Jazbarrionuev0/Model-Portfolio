import { BaseRepository } from "@/lib/database/repositories/baseRepository";
import { getRedisData, setRedisData } from "@/lib/database/redis";

// Mock the Redis functions
jest.mock("@/lib/database/redis", () => ({
  getRedisData: jest.fn(),
  setRedisData: jest.fn(),
}));

// Mock the utils
jest.mock("@/lib/utils", () => ({
  logError: jest.fn(),
}));

interface TestEntity {
  id: number;
  name: string;
}

class TestRepository extends BaseRepository<TestEntity> {
  constructor() {
    super("test");
  }

  async getTestEntities(): Promise<TestEntity[]> {
    return this.getAll();
  }

  async addTestEntity(entity: Omit<TestEntity, "id">): Promise<TestEntity> {
    return this.add(entity);
  }

  async updateTestEntity(entity: TestEntity): Promise<void> {
    return this.update(entity);
  }

  async deleteTestEntity(id: number): Promise<TestEntity> {
    return this.delete(id);
  }

  async getTestEntity(id: number): Promise<TestEntity> {
    return this.getById(id);
  }
}

describe("BaseRepository", () => {
  let repository: TestRepository;
  const mockGetRedisData = getRedisData as jest.MockedFunction<typeof getRedisData>;
  const mockSetRedisData = setRedisData as jest.MockedFunction<typeof setRedisData>;

  beforeEach(() => {
    repository = new TestRepository();
    jest.clearAllMocks();
    // Mock Date.now to return a consistent timestamp
    jest.spyOn(Date, "now").mockReturnValue(1234567890);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAll", () => {
    it("should return all entities", async () => {
      const mockData = [
        { id: 1, name: "Test 1" },
        { id: 2, name: "Test 2" },
      ];
      mockGetRedisData.mockResolvedValue(mockData);

      const result = await repository.getTestEntities();

      expect(result).toEqual(mockData);
      expect(mockGetRedisData).toHaveBeenCalledWith("test");
    });
  });

  describe("add", () => {
    it("should add a new entity with generated ID", async () => {
      const existingData = [{ id: 1, name: "Existing" }];
      const newEntity = { name: "New Entity" };
      const expectedEntity = { id: 1234567890, name: "New Entity" };

      mockGetRedisData.mockResolvedValue(existingData);
      mockSetRedisData.mockResolvedValue(undefined);

      const result = await repository.addTestEntity(newEntity);

      expect(result).toEqual(expectedEntity);
      expect(mockSetRedisData).toHaveBeenCalledWith("test", [...existingData, expectedEntity]);
    });
  });

  describe("update", () => {
    it("should update existing entity", async () => {
      const existingData = [
        { id: 1, name: "Entity 1" },
        { id: 2, name: "Entity 2" },
      ];
      const updatedEntity = { id: 1, name: "Updated Entity" };

      mockGetRedisData.mockResolvedValue(existingData);
      mockSetRedisData.mockResolvedValue(undefined);

      await repository.updateTestEntity(updatedEntity);

      expect(mockSetRedisData).toHaveBeenCalledWith("test", [updatedEntity, { id: 2, name: "Entity 2" }]);
    });

    it("should throw error if entity not found", async () => {
      const existingData = [{ id: 1, name: "Entity 1" }];
      const nonExistentEntity = { id: 999, name: "Non-existent" };

      mockGetRedisData.mockResolvedValue(existingData);

      await expect(repository.updateTestEntity(nonExistentEntity)).rejects.toThrow("test item not found");
    });
  });

  describe("delete", () => {
    it("should delete existing entity", async () => {
      const existingData = [
        { id: 1, name: "Entity 1" },
        { id: 2, name: "Entity 2" },
      ];

      mockGetRedisData.mockResolvedValue(existingData);
      mockSetRedisData.mockResolvedValue(undefined);

      const result = await repository.deleteTestEntity(1);

      expect(result).toEqual({ id: 1, name: "Entity 1" });
      expect(mockSetRedisData).toHaveBeenCalledWith("test", [{ id: 2, name: "Entity 2" }]);
    });

    it("should throw error if entity not found for deletion", async () => {
      const existingData = [{ id: 1, name: "Entity 1" }];

      mockGetRedisData.mockResolvedValue(existingData);

      await expect(repository.deleteTestEntity(999)).rejects.toThrow("test item not found");
    });
  });

  describe("getById", () => {
    it("should return entity by ID", async () => {
      const existingData = [
        { id: 1, name: "Entity 1" },
        { id: 2, name: "Entity 2" },
      ];

      mockGetRedisData.mockResolvedValue(existingData);

      const result = await repository.getTestEntity(1);

      expect(result).toEqual({ id: 1, name: "Entity 1" });
    });

    it("should throw error if entity not found by ID", async () => {
      const existingData = [{ id: 1, name: "Entity 1" }];

      mockGetRedisData.mockResolvedValue(existingData);

      await expect(repository.getTestEntity(999)).rejects.toThrow("test item not found");
    });
  });
});
