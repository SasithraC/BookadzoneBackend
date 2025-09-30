import agencyService from '../agencyService';
import agencyRepository from '../../repositories/agencyRepository';

jest.mock('../../repositories/agencyRepository');

describe('AgencyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create agency', async () => {
    (agencyRepository.createAgency as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await agencyService.createAgency({ agencyName: 'Test' } as any);
    expect(result).toEqual({ id: '1' });
  });

  it('should get all agencies', async () => {
    (agencyRepository.getAllAgencies as jest.Mock).mockResolvedValue({ agencies: [], total: 0, page: 1, limit: 10 });
    const result = await agencyService.getAllAgencies(1, 10);
    expect(result).toHaveProperty('agencies');
  });

  it('should get agency by id', async () => {
    (agencyRepository.getAgencyById as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await agencyService.getAgencyById('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should update agency', async () => {
    (agencyRepository.updateAgency as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await agencyService.updateAgency('1', { agencyName: 'Updated' });
    expect(result).toEqual({ id: '1' });
  });

  it('should delete agency', async () => {
    (agencyRepository.softDeleteAgency as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await agencyService.deleteAgency('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should restore agency', async () => {
    (agencyRepository.restoreAgency as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await agencyService.restoreAgency('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should get all trash agencies', async () => {
    (agencyRepository.getAllTrashAgencies as jest.Mock).mockResolvedValue({ agencies: [], total: 0, page: 1, limit: 10 });
    const result = await agencyService.getAllTrashAgencies(1, 10);
    expect(result).toHaveProperty('agencies');
  });

  it('should toggle status', async () => {
    (agencyRepository.toggleStatus as jest.Mock).mockResolvedValue({ id: '1', status: 'inactive' });
    const result = await agencyService.toggleStatus('1');
    expect(result).toEqual({ id: '1', status: 'inactive' });
  });

  it('should delete agency permanently', async () => {
    (agencyRepository.deleteAgencyPermanently as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await agencyService.deleteAgencyPermanently('1');
    expect(result).toEqual({ id: '1' });
  });
});
