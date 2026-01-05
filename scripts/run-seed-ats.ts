
import { seedATS } from '../src/lib/actions/seed-ats';

async function main() {
    console.log('Starting ATS Seed...');
    await seedATS();
    console.log('Done.');
}

main().catch(console.error);
