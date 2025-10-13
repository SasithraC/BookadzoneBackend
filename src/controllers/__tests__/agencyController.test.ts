import request from 'supertest';
import express from 'express';
import agencyController from '../agencyController';
import agencyService from '../../services/agencyService';

jest.mock('../../services/agencyService');

const app = express();
app.use(express.json());
app.post('/agencies', agencyController.createAgency.bind(agencyController));
app.get('/agencies', agencyController.getAllAgencies.bind(agencyController));
app.get('/agencies/:id', agencyController.getAgencyById.bind(agencyController));
app.put('/agencies/:id', agencyController.updateAgency.bind(agencyController));
app.delete('/agencies/:id', agencyController.deleteAgency.bind(agencyController));
app.post('/agencies/:id/restore', agencyController.restoreAgency.bind(agencyController));
app.get('/agencies-trash', agencyController.getAllTrashAgencies.bind(agencyController));
app.patch('/agencies/:id/toggle-status', agencyController.toggleAgencyStatus.bind(agencyController));
app.delete('/agencies/:id/permanent', agencyController.deleteAgencyPermanently.bind(agencyController));

describe('AgencyController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an agency', async () => {
    (agencyService.createAgency as jest.Mock).mockResolvedValue({ id: '1' });
    const res = await request(app).post('/agencies').send({ agencyName: 'Test', name: 'Test', yourEmail: 'a@a.com', yourPhone: '123', password: 'pass' });
    expect(res.status).toBe(201);
  expect(res.body.status === 'success' || res.body.status === true).toBeTruthy();
  });

  it('should get all agencies', async () => {
    (agencyService.getAllAgencies as jest.Mock).mockResolvedValue({ agencies: [], total: 0, page: 1, limit: 10 });
    const res = await request(app).get('/agencies');
    expect(res.status).toBe(200);
  expect(res.body.status === 'success' || res.body.status === true).toBeTruthy();
  });

  it('should get agency by id', async () => {
    (agencyService.getAgencyById as jest.Mock).mockResolvedValue({ id: '1' });
    const res = await request(app).get('/agencies/1');
    expect(res.status).toBe(200);
  expect(res.body.status === 'success' || res.body.status === true).toBeTruthy();
  });

  it('should update agency', async () => {
    (agencyService.updateAgency as jest.Mock).mockResolvedValue({ id: '1' });
    const res = await request(app).put('/agencies/1').send({ agencyName: 'Updated' });
    expect(res.status).toBe(200);
  expect(res.body.status === 'success' || res.body.status === true).toBeTruthy();
  });

  it('should delete agency', async () => {
    (agencyService.deleteAgency as jest.Mock).mockResolvedValue({ id: '1' });
    const res = await request(app).delete('/agencies/1');
    expect(res.status).toBe(200);
  expect(res.body.status === 'success' || res.body.status === true).toBeTruthy();
  });

  it('should restore agency', async () => {
    (agencyService.restoreAgency as jest.Mock).mockResolvedValue({ id: '1' });
    const res = await request(app).post('/agencies/1/restore');
    expect(res.status).toBe(200);
  expect(res.body.status === 'success' || res.body.status === true).toBeTruthy();
  });

  it('should get all trash agencies', async () => {
    (agencyService.getAllTrashAgencies as jest.Mock).mockResolvedValue({ agencies: [], total: 0, page: 1, limit: 10 });
    const res = await request(app).get('/agencies-trash');
    expect(res.status).toBe(200);
  expect(res.body.status === 'success' || res.body.status === true).toBeTruthy();
  });

  it('should toggle agency status', async () => {
    (agencyService.toggleStatus as jest.Mock).mockResolvedValue({ id: '1', status: 'inactive' });
    const res = await request(app).patch('/agencies/1/toggle-status');
    expect(res.status).toBe(200);
  expect(res.body.status === 'success' || res.body.status === true).toBeTruthy();
  });

  it('should delete agency permanently', async () => {
    (agencyService.deleteAgencyPermanently as jest.Mock).mockResolvedValue({ id: '1' });
    const res = await request(app).delete('/agencies/1/permanent');
    expect(res.status).toBe(200);
  expect(res.body.status === 'success' || res.body.status === true).toBeTruthy();
  });
});
