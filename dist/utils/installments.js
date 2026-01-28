"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInstallments = void 0;
const buildInstallments = (purchase) => {
    const total = purchase.amount * (1 + (purchase.interestRate || 0) / 100);
    const base = Number((total / purchase.tenureMonths).toFixed(2));
    const installments = [];
    let accumulated = 0;
    for (let i = 0; i < purchase.tenureMonths; i++) {
        const dueDate = new Date(purchase.startDate);
        dueDate.setMonth(dueDate.getMonth() + i + 1);
        let amount = base;
        if (i === purchase.tenureMonths - 1) {
            amount = Number((total - accumulated).toFixed(2));
        }
        accumulated += amount;
        installments.push({
            purchaseId: purchase._id,
            sequence: i + 1,
            dueDate,
            amount,
            status: 'pending',
        });
    }
    return installments;
};
exports.buildInstallments = buildInstallments;
//# sourceMappingURL=installments.js.map