"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpResponse_1 = require("../httpResponse");
describe('HTTP_RESPONSE and HTTP_STATUS_CODE', () => {
    it('has correct status flags', () => {
        expect(httpResponse_1.HTTP_RESPONSE.SUCCESS).toBe(true);
        expect(httpResponse_1.HTTP_RESPONSE.FAIL).toBe(false);
    });
    it('contains status codes', () => {
        expect(httpResponse_1.HTTP_STATUS_CODE.OK).toBe(200);
        expect(httpResponse_1.HTTP_STATUS_CODE.BAD_REQUEST).toBe(400);
        expect(httpResponse_1.HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).toBe(500);
    });
});
