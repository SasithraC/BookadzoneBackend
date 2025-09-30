import { AgencyModel } from '../agencyModel';

describe('AgencyModel', () => {
  it('should have required fields', () => {
    const agency = new AgencyModel({
      agencyName: 'Test',
      name: 'Test',
      yourEmail: 'a@a.com',
      yourPhone: '123',
      password: 'pass',
    });
    expect(agency.agencyName).toBe('Test');
    expect(agency.name).toBe('Test');
    expect(agency.yourEmail).toBe('a@a.com');
    expect(agency.yourPhone).toBe('123');
    expect(agency.password).toBe('pass');
    expect(agency.status).toBe('active');
    expect(agency.isDeleted).toBe(false);
  });

  it('should set default values', () => {
    const agency = new AgencyModel({
      agencyName: 'Test',
      name: 'Test',
      yourEmail: 'a@a.com',
      yourPhone: '123',
      password: 'pass',
    });
    expect(agency.status).toBe('active');
    expect(agency.isDeleted).toBe(false);
  });
});
