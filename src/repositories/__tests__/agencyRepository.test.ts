// Mock mongoose first
jest.mock('mongoose', () => {
  class ObjectId {
    constructor(private readonly id: string) {}
    toString() { return this.id; }
  }

  const Schema = function() { return { Types: { ObjectId } }; };
  Schema.Types = { ObjectId };
  
  return {
    Schema,
    model: () => ({}),
    Types: { ObjectId },
  };
});

// Then import and mock the model
const mockModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
};

jest.mock('../../models/agencyModel', () => mockModel);

describe('AgencyRepository', () => {
  const repo = require('../../repositories/agencyRepository').default;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create agency', async () => {
    mockModel.create.mockResolvedValue({ id: '1' });
    const result = await repo.createAgency({ agencyName: 'Test' });
    expect(result).toEqual({ id: '1' });
  });

  it('should get all agencies', async () => {
    const mockSkipResult = { limit: jest.fn().mockResolvedValue([{ id: '1' }]) };
    const mockSkip = jest.fn().mockReturnValue(mockSkipResult);
    mockModel.find.mockReturnValue({ skip: mockSkip });
    mockModel.countDocuments.mockResolvedValue(1);
    const result = await repo.getAllAgencies(1, 10);
    expect(result).toHaveProperty('agencies');
  });

  it('should get agency by id', async () => {
    mockModel.aggregate.mockResolvedValue([{ id: '1', yourEmail: 'test@example.com' }]);
    const result = await repo.getAgencyById('1');
    expect(result).toEqual({ id: '1', yourEmail: 'test@example.com' });
  });

  it('should update agency', async () => {
    mockModel.findByIdAndUpdate.mockResolvedValue({ id: '1' });
    const result = await repo.updateAgency('1', { agencyName: 'Updated' });
    expect(result).toEqual({ id: '1' });
  });

  it('should soft delete agency', async () => {
    mockModel.findByIdAndUpdate.mockResolvedValue({ id: '1', isDeleted: true });
    const result = await repo.softDeleteAgency('1');
    expect(result).toEqual({ id: '1', isDeleted: true });
  });

  it('should restore agency', async () => {
    mockModel.findByIdAndUpdate.mockResolvedValue({ id: '1', isDeleted: false });
    const result = await repo.restoreAgency('1');
    expect(result).toEqual({ id: '1', isDeleted: false });
  });

  it('should get all trash agencies', async () => {
    const mockSkipResult = { limit: jest.fn().mockResolvedValue([{ id: '1' }]) };
    const mockSkip = jest.fn().mockReturnValue(mockSkipResult);
    mockModel.find.mockReturnValue({ skip: mockSkip });
    mockModel.countDocuments.mockResolvedValue(1);
    const result = await repo.getAllTrashAgencies(1, 10);
    expect(result).toHaveProperty('agencies');
  });

  it('should toggle status', async () => {
    mockModel.findById.mockResolvedValue({ id: '1', status: 'active' });
    mockModel.findByIdAndUpdate.mockResolvedValue({ id: '1', status: 'inactive' });
    const result = await repo.toggleStatus('1');
    expect(result).toEqual({ id: '1', status: 'inactive' });
  });

  it('should delete agency permanently', async () => {
    mockModel.findByIdAndDelete.mockResolvedValue({ id: '1' });
    const result = await repo.deleteAgencyPermanently('1');
    expect(result).toEqual({ id: '1' });
  });
});
