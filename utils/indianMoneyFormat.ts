export const formatIndianMoney = (amount: number | string): string => {
    // Convert to number if input is string
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Handle NaN cases
    if (isNaN(num)) return '₹0';
    
    // Format with Indian locale commas
    return '₹' + num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
    });
};
