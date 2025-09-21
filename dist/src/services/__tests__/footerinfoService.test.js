"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const footerInfo_1 = __importDefault(require("../footerInfo"));
describe('FooterService', () => {
    it('throws if logo missing', async () => {
        await expect(footerInfo_1.default.createFooterInfo({
            description: 'Some description',
            priority: 1,
            status: 'active',
            isDeleted: false,
        })).rejects.toThrow('logo is required');
    });
    it('throws if description missing', async () => {
        const uniqueLogo = `logo-${Date.now()}-desc.png`;
        await expect(footerInfo_1.default.createFooterInfo({
            logo: uniqueLogo,
            priority: 1,
            status: 'active',
            isDeleted: false,
        })).rejects.toThrow('description is required');
    });
    it('throws on invalid status', async () => {
        const uniqueLogo = `logo-${Date.now()}-status.png`;
        await expect(footerInfo_1.default.createFooterInfo({
            logo: uniqueLogo,
            description: 'Some description',
            priority: 2,
            status: 'wrong',
            isDeleted: false,
        })).rejects.toThrow(/status must be one of/);
    });
    it('creates successfully with valid data', async () => {
        const uniqueLogo = `logo-${Date.now()}-valid.png`; // 👈 always unique
        const data = {
            logo: uniqueLogo,
            description: 'Valid description',
            socialmedia: 'facebook',
            socialmedialinks: 'https://fb.com',
            google: 'https://google.com',
            appstore: 'https://appstore.com',
            priority: 5,
            status: 'active',
            isDeleted: false,
        };
        const result = await footerInfo_1.default.createFooterInfo(data);
        expect(result).toHaveProperty('logo', uniqueLogo);
        expect(result).toHaveProperty('description', 'Valid description');
        expect(result).toHaveProperty('priority', 5);
        expect(['active', 'inactive']).toContain(result.status);
    });
});
