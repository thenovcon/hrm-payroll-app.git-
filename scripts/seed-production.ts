
import { seedDemoData } from '../src/lib/actions/seed-demo';

console.log('🌱 Starting production seed...');
seedDemoData()
    .then((result) => {
        if (result.success) {
            console.log('✅ ' + result.message);
            process.exit(0);
        } else {
            console.error('❌ ' + result.error);
            process.exit(1);
        }
    })
    .catch((e) => {
        console.error('❌ Unexpected error:', e);
        process.exit(1);
    });
