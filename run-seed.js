import { seedDemoData } from './src/lib/actions/seed-demo';

seedDemoData().then(result => {
    console.log(result);
    process.exit(0);
}).catch(error => {
    console.error('Seed failed:', error);
    process.exit(1);
});
