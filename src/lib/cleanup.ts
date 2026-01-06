
import { prisma } from "@/lib/db/prisma";

export async function cleanupFailedImports() {
    try {
        // 1. Identify records missing mandatory relations created recently (or broadly)
        // "Ghost records" = Missing Salary Structure OR Missing Department/Position (if those are critical)

        const deleted = await prisma.employee.deleteMany({
            where: {
                OR: [
                    { departmentId: null },
                    { position: "" },
                    { salaryStructure: { is: null } }
                ]
            }
        });

        console.log(`Successfully purged ${deleted.count} partial records.`);
        return { success: true, count: deleted.count };
    } catch (error) {
        console.error("Cleanup failed:", error);
        return { success: false, error: String(error) };
    }
}
