"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entityMessage_1 = require("../entityMessage");
describe('SuccessMessage', () => {
    it('gives correct messages for types', () => {
        expect((0, entityMessage_1.SuccessMessage)('FAQ', { type: 'created' })).toBe('FAQ has been created successfully');
        expect((0, entityMessage_1.SuccessMessage)('FAQ', { type: 'updated' })).toBe('FAQ has been updated successfully');
        expect((0, entityMessage_1.SuccessMessage)('FAQ', { type: 'deleted' })).toBe('FAQ has been deleted successfully');
        expect((0, entityMessage_1.SuccessMessage)('FAQ', { type: 'invalid' })).toBe('');
    });
});
