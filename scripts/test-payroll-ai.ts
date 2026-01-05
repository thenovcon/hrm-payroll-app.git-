import dotenv from 'dotenv';
dotenv.config();

// Dynamic import to ensure env vars are loaded first
async function main() {
    const { analyzeVariance } = await import('../src/lib/actions/payroll-ai');

    console.log('Testing Payroll AI Variance Analysis with Gemini...');

    const previous = {
        net: 150000,
        cost: 200000,
        count: 50,
        newHires: 0,
        departures: 0,
        bonuses: 0
    };

    const current = {
        net: 165000,
        cost: 220000,
        count: 52,
        newHires: 2,
        departures: 0,
        bonuses: 5000
    };

    console.log('--- Input Data ---');
    console.log('Previous Run:', previous);
    console.log('Current Run:', current);
    console.log('------------------');

    try {
        const result = await analyzeVariance(current, previous);
        console.log('\n--- AI Response ---');
        console.log(result);
        console.log('-------------------');
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

main();
