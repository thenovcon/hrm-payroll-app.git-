const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, '../src/lib/version.ts');

try {
    let content = fs.readFileSync(versionFilePath, 'utf8');

    // Extract current revision
    const revMatch = content.match(/REVISION = (\d+);/);
    if (revMatch) {
        const currentRev = parseInt(revMatch[1], 10);
        const newRev = currentRev + 1;

        // Update revision
        content = content.replace(/REVISION = \d+;/, `REVISION = ${newRev};`);

        // Update timestamp
        const now = new Date().toISOString();
        content = content.replace(/BUILD_TIMESTAMP = "[^"]+";/, `BUILD_TIMESTAMP = "${now}";`);

        fs.writeFileSync(versionFilePath, content);
        console.log(`✅ Bumped revision to ${newRev} and updated timestamp.`);
    } else {
        console.error('❌ Could not find REVISION constant in version.ts');
        process.exit(1);
    }
} catch (error) {
    console.error('❌ Error updating version:', error);
    process.exit(1);
}
