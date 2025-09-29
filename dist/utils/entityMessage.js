"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessMessage = SuccessMessage;
function SuccessMessage(entity, action) {
    switch (action.type) {
        case 'created':
            return `${entity} has been created successfully`;
        case 'updated':
            return `${entity} has been updated successfully`;
        case 'deleted':
            return `${entity} has been deleted successfully`;
        default:
            return '';
    }
}
