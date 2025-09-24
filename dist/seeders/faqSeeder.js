"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faqModel_1 = require("../models/faqModel");
const seedFaqs = async () => {
    try {
        await faqModel_1.FaqModel.deleteMany();
        const faqs = [
            {
                question: "What is a billboard booking on Bookadzone?",
                answer: "A billboard booking on Bookadzone allows you to reserve advertising space on our outdoor billboards for your campaign through our platform.",
                status: "active",
                isDeleted: false,
            },
            {
                question: "How do I book a billboard on Bookadzone?",
                answer: "You can book a billboard on Bookadzone by signing in, selecting your desired location and duration, and completing the payment process on our platform.",
                status: "active",
                isDeleted: false,
            },
            {
                question: "What are the payment options on Bookadzone?",
                answer: "On Bookadzone, we accept credit/debit cards, net banking, and digital wallets for all billboard bookings.",
                status: "inactive",
                isDeleted: false,
            },
        ];
        await faqModel_1.FaqModel.insertMany(faqs);
        console.log(" FAQ data seeded successfully");
    }
    catch (error) {
        console.error("Seeding FAQs failed:", error);
    }
};
exports.default = seedFaqs;
