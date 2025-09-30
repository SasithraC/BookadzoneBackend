import agencyRepository from '../agencyRepository';
import { AgencyModel } from '../../models/agencyModel';

jest.mock('../../models/agencyModel');

const mockAgencyModel = AgencyModel as jest.Mocked<typeof AgencyModel>;

describe('AgencyRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create agency', async () => {
    mockAgencyModel.create.mockResolvedValue({ id: '1' } as any);
    const repo = require('../../repositories/agencyRepository').default;
    const result = await repo.createAgency({ agencyName: 'Test' });
    expect(result).toEqual({ id: '1' });
  });

  it('should get all agencies', async () => {
    mockAgencyModel.find.mockReturnValue({ skip: () => ({ limit: () => Promise.resolve([{ id: '1' }]) }) } as any);
    mockAgencyModel.countDocuments.mockResolvedValue(1 as any);
    const repo = require('../../repositories/agencyRepository').default;
    const result = await repo.getAllAgencies(1, 10);
    expect(result).toHaveProperty('agencies');
  });

  it('should get agency by id', async () => {
    mockAgencyModel.findById.mockResolvedValue({ id: '1' } as any);
    const repo = require('../../repositories/agencyRepository').default;
    const result = await repo.getAgencyById('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should update agency', async () => {
    mockAgencyModel.findByIdAndUpdate.mockResolvedValue({ id: '1' } as any);
    const repo = require('../../repositories/agencyRepository').default;
    const result = await repo.updateAgency('1', { agencyName: 'Updated' });
    expect(result).toEqual({ id: '1' });
  });

  it('should soft delete agency', async () => {
    mockAgencyModel.findByIdAndUpdate.mockResolvedValue({ id: '1', isDeleted: true } as any);
    const repo = require('../../repositories/agencyRepository').default;
    const result = await repo.softDeleteAgency('1');
    expect(result).toEqual({ id: '1', isDeleted: true });
  });

  it('should restore agency', async () => {
    mockAgencyModel.findByIdAndUpdate.mockResolvedValue({ id: '1', isDeleted: false } as any);
    const repo = require('../../repositories/agencyRepository').default;
    const result = await repo.restoreAgency('1');
    expect(result).toEqual({ id: '1', isDeleted: false });
  });

  it('should get all trash agencies', async () => {
    mockAgencyModel.find.mockReturnValue({ skip: () => ({ limit: () => Promise.resolve([{ id: '1' }]) }) } as any);
    mockAgencyModel.countDocuments.mockResolvedValue(1 as any);
    const repo = require('../../repositories/agencyRepository').default;
    const result = await repo.getAllTrashAgencies(1, 10);
    expect(result).toHaveProperty('agencies');
  });

  it('should toggle status', async () => {
    mockAgencyModel.findById.mockResolvedValue({ id: '1', status: 'active' } as any);
    mockAgencyModel.findByIdAndUpdate.mockResolvedValue({ id: '1', status: 'inactive' } as any);
    const repo = require('../../repositories/agencyRepository').default;
    const result = await repo.toggleStatus('1');
    expect(result).toEqual({ id: '1', status: 'inactive' });
  });

  it('should delete agency permanently', async () => {
    mockAgencyModel.findByIdAndDelete.mockResolvedValue({ id: '1' } as any);
    const repo = require('../../repositories/agencyRepository').default;
    const result = await repo.deleteAgencyPermanently('1');
    expect(result).toEqual({ id: '1' });
  });
});
