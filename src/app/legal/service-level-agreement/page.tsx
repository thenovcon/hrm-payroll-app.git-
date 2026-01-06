
import React from 'react';

export default function SLA() {
    return (
        <div>
            <h1>SERVICE LEVEL AGREEMENT (SLA)</h1>
            <p>Effective Date: January 1, 2026</p>
            <p>This Service Level Agreement ("SLA") defines the performance standards and availability commitments for the Novelty Concepts Ltd HRM & Payroll System.</p>

            <h2>1. DEFINITIONS</h2>
            <ul>
                <li>"Downtime": Periods when the System is unavailable to users due to our infrastructure or software failures</li>
                <li>"Uptime": The percentage of time the System is available and operational</li>
                <li>"Planned Maintenance": Scheduled downtime for system updates, announced in advance</li>
                <li>"Service Credit": Compensation provided for SLA breaches</li>
                <li>"Response Time": Time from ticket submission to initial response</li>
                <li>"Resolution Time": Time from ticket submission to issue resolution</li>
            </ul>

            <h2>2. SERVICE AVAILABILITY</h2>
            <h3>2.1 Uptime Commitment</h3>
            <p>We commit to 99.5% uptime calculated monthly.</p>

            <h3>2.2 Uptime Calculation</h3>
            <p>Uptime % = (Total Minutes in Month - Downtime Minutes) / Total Minutes in Month × 100</p>

            <h3>2.3 Exclusions from Downtime</h3>
            <p>The following are NOT counted as Downtime:</p>
            <ul>
                <li>Planned maintenance (with 72-hour notice)</li>
                <li>Emergency maintenance (up to 4 hours per month)</li>
                <li>Force majeure events (natural disasters, wars, civil unrest)</li>
                <li>Issues caused by client equipment or internet connectivity</li>
                <li>Problems resulting from client misuse or unauthorized modifications</li>
                <li>Third-party service outages beyond our control</li>
                <li>DDoS attacks or security incidents</li>
            </ul>

            <h3>2.4 Service Availability by Tier</h3>
            <ul>
                <li>Standard Tier: 99.5% uptime</li>
                <li>Premium Tier: 99.7% uptime (if offered)</li>
                <li>Enterprise Tier: 99.9% uptime (if offered)</li>
            </ul>

            <h2>3. PLANNED MAINTENANCE</h2>
            <h3>3.1 Maintenance Windows</h3>
            <ul>
                <li>Scheduled monthly (typically first Sunday of each month)</li>
                <li>Time: 11:00 PM - 3:00 AM GMT (low-traffic period)</li>
                <li>Duration: Maximum 4 hours</li>
            </ul>

            <h3>3.2 Advance Notice</h3>
            <ul>
                <li>Standard maintenance: 72 hours' notice via email and in-app notification</li>
                <li>Extended maintenance: 7 days' notice</li>
            </ul>

            <h3>3.3 Emergency Maintenance</h3>
            <ul>
                <li>May occur without advance notice</li>
                <li>Limited to critical security patches or urgent fixes</li>
                <li>Will not exceed 4 hours per month</li>
            </ul>

            <h2>4. PERFORMANCE STANDARDS</h2>
            <h3>4.1 System Performance</h3>
            <ul>
                <li>Page Load Time: ≤ 3 seconds for 95% of page loads</li>
                <li>API Response Time: ≤ 2 seconds for 95% of API calls</li>
                <li>Report Generation: ≤ 30 seconds for standard reports</li>
                <li>Payroll Processing: ≤ 5 minutes for up to 500 employees</li>
            </ul>

            <h3>4.2 Concurrent Users</h3>
            <p>The System supports:</p>
            <ul>
                <li>Standard Tier: Up to 100 concurrent users</li>
                <li>Premium Tier: Up to 500 concurrent users</li>
                <li>Enterprise Tier: Unlimited concurrent users</li>
            </ul>

            <h2>5. SUPPORT RESPONSE TIMES</h2>
            <h3>5.1 Support Channels</h3>
            <ul>
                <li>Email: support@thenoveltyconcepts.com</li>
                <li>Phone: +233 20 021 7444</li>
                <li>In-app ticket system</li>
                <li>Live chat (Premium and Enterprise tiers)</li>
            </ul>

            <h3>5.2 Support Hours</h3>
            <ul>
                <li>Business Hours: Monday-Friday, 8:00 AM - 5:00 PM GMT</li>
                <li>After Hours: Email/ticket support only (Standard Tier)</li>
                <li>24/7 Support: Available for Premium and Enterprise tiers</li>
            </ul>

            <h3>5.3 Severity Levels</h3>
            <ul>
                <li><strong>Critical (Severity 1):</strong> System completely unavailable, Data loss or corruption, Security breach, Payroll cannot be processed</li>
                <li><strong>High (Severity 2):</strong> Major feature unavailable, Significant performance degradation, Multiple users affected</li>
                <li><strong>Medium (Severity 3):</strong> Minor feature malfunction, Workaround available, Limited users affected</li>
                <li><strong>Low (Severity 4):</strong> Cosmetic issues, Feature requests, General inquiries</li>
            </ul>

            <h3>5.4 Response Time Commitments</h3>
            <table className="min-w-full text-left text-sm whitespace-nowrap mb-6">
                <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 border-neutral-200">
                    <tr>
                        <th scope="col" className="px-6 py-4">Severity</th>
                        <th scope="col" className="px-6 py-4">Standard Tier</th>
                        <th scope="col" className="px-6 py-4">Premium Tier</th>
                        <th scope="col" className="px-6 py-4">Enterprise Tier</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">Critical</td>
                        <td className="px-6 py-4">4 hours</td>
                        <td className="px-6 py-4">2 hours</td>
                        <td className="px-6 py-4">1 hour</td>
                    </tr>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">High</td>
                        <td className="px-6 py-4">8 hours</td>
                        <td className="px-6 py-4">4 hours</td>
                        <td className="px-6 py-4">2 hours</td>
                    </tr>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">Medium</td>
                        <td className="px-6 py-4">24 hours</td>
                        <td className="px-6 py-4">12 hours</td>
                        <td className="px-6 py-4">8 hours</td>
                    </tr>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">Low</td>
                        <td className="px-6 py-4">48 hours</td>
                        <td className="px-6 py-4">24 hours</td>
                        <td className="px-6 py-4">24 hours</td>
                    </tr>
                </tbody>
            </table>

            <h3>5.5 Resolution Time Targets</h3>
            <table className="min-w-full text-left text-sm whitespace-nowrap mb-6">
                <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 border-neutral-200">
                    <tr>
                        <th scope="col" className="px-6 py-4">Severity</th>
                        <th scope="col" className="px-6 py-4">Target Resolution</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">Critical</td>
                        <td className="px-6 py-4">12 hours</td>
                    </tr>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">High</td>
                        <td className="px-6 py-4">24 hours</td>
                    </tr>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">Medium</td>
                        <td className="px-6 py-4">72 hours</td>
                    </tr>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">Low</td>
                        <td className="px-6 py-4">5 business days</td>
                    </tr>
                </tbody>
            </table>
            <p>Note: Resolution times are best-effort targets, not guarantees.</p>

            <h2>6. DATA BACKUP AND RECOVERY</h2>
            <h3>6.1 Backup Schedule</h3>
            <ul>
                <li>Full Backups: Daily at 2:00 AM GMT</li>
                <li>Incremental Backups: Every 6 hours</li>
                <li>Retention: 30 days</li>
            </ul>

            <h3>6.2 Recovery Point Objective (RPO)</h3>
            <p>Maximum data loss: 6 hours (time since last incremental backup)</p>

            <h3>6.3 Recovery Time Objective (RTO)</h3>
            <p>Target recovery time: 4 hours from disaster declaration</p>

            <h3>6.4 Backup Testing</h3>
            <ul>
                <li>Backup integrity tested monthly</li>
                <li>Full disaster recovery drill conducted quarterly</li>
            </ul>

            <h2>7. SECURITY COMMITMENTS</h2>
            <h3>7.1 Security Measures</h3>
            <ul>
                <li>SSL/TLS encryption for all data transmission</li>
                <li>Data encryption at rest (AES-256)</li>
                <li>Regular security audits (quarterly)</li>
                <li>Vulnerability scanning (weekly)</li>
                <li>Penetration testing (annually)</li>
            </ul>

            <h3>7.2 Security Incident Response</h3>
            <ul>
                <li>Incident detection: Within 4 hours</li>
                <li>Customer notification: Within 72 hours of confirmed breach</li>
                <li>Incident resolution: Within 48 hours of detection</li>
            </ul>

            <h3>7.3 Compliance</h3>
            <ul>
                <li>Ghana Data Protection Act compliance</li>
                <li>ISO 27001 principles adherence</li>
                <li>Regular compliance audits</li>
            </ul>

            <h2>8. MONITORING AND REPORTING</h2>
            <h3>8.1 System Monitoring</h3>
            <p>We monitor:</p>
            <ul>
                <li>System availability (24/7 automated monitoring)</li>
                <li>Performance metrics</li>
                <li>Error rates</li>
                <li>Security threats</li>
            </ul>

            <h3>8.2 Status Page</h3>
            <ul>
                <li>Real-time system status available at status.novconghana.com</li>
                <li>Incident notifications</li>
                <li>Maintenance schedules</li>
            </ul>

            <h3>8.3 Monthly Reports</h3>
            <p>Premium and Enterprise clients receive:</p>
            <ul>
                <li>Uptime percentage</li>
                <li>Performance metrics</li>
                <li>Support ticket summary</li>
                <li>Incident reports</li>
            </ul>

            <h2>9. SERVICE CREDITS</h2>
            <h3>9.1 Eligibility</h3>
            <p>Service credits are available if:</p>
            <ul>
                <li>Uptime falls below 99.5% (or tier-specific threshold)</li>
                <li>The client reports the issue within 5 business days of occurrence</li>
                <li>Downtime is not excluded per Section 2.3</li>
            </ul>

            <h3>9.2 Credit Calculation</h3>
            <table className="min-w-full text-left text-sm whitespace-nowrap mb-6">
                <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 border-neutral-200">
                    <tr>
                        <th scope="col" className="px-6 py-4">Uptime Achievement</th>
                        <th scope="col" className="px-6 py-4">Service Credit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">99.0% - &lt; 99.5%</td>
                        <td className="px-6 py-4">5% of monthly fees</td>
                    </tr>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">98.0% - &lt; 99.0%</td>
                        <td className="px-6 py-4">10% of monthly fees</td>
                    </tr>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">95.0% - &lt; 98.0%</td>
                        <td className="px-6 py-4">25% of monthly fees</td>
                    </tr>
                    <tr className="border-b dark:border-neutral-600 border-neutral-200">
                        <td className="px-6 py-4">&lt; 95.0%</td>
                        <td className="px-6 py-4">50% of monthly fees</td>
                    </tr>
                </tbody>
            </table>

            <h3>9.3 Maximum Credit</h3>
            <p>Total service credits in any month shall not exceed 50% of that month's subscription fees.</p>

            <h3>9.4 Claiming Credits</h3>
            <p>To claim service credits:</p>
            <ul>
                <li>Submit a claim to support@thenoveltyconcepts.com within 5 business days</li>
                <li>Include dates/times of unavailability</li>
                <li>Describe the impact on your operations</li>
            </ul>

            <h3>9.5 Credit Application</h3>
            <ul>
                <li>Credits applied to next month's invoice</li>
                <li>No cash refunds for service credits</li>
                <li>Credits do not extend subscription term</li>
            </ul>

            <h3>9.6 Sole Remedy</h3>
            <p>Service credits are your sole remedy for SLA breaches. We have no other liability for availability issues.</p>

            <h2>10. ESCALATION PROCEDURES</h2>
            <h3>10.1 Standard Escalation Path</h3>
            <ul>
                <li>Level 1: Support Team (initial contact)</li>
                <li>Level 2: Technical Team Lead</li>
                <li>Level 3: Engineering Manager</li>
                <li>Level 4: CTO / Operations Director</li>
            </ul>

            <h3>10.2 Escalation Triggers</h3>
            <p>Auto-escalation occurs when:</p>
            <ul>
                <li>Severity 1 issue unresolved after 4 hours</li>
                <li>Severity 2 issue unresolved after 12 hours</li>
                <li>Customer specifically requests escalation</li>
            </ul>

            <h3>10.3 Management Escalation</h3>
            <p>Enterprise clients may escalate critical issues directly to:</p>
            <ul>
                <li>Technical Escalation: support@thenoveltyconcepts.com</li>
                <li>Management Contact: [Name], Operations Director</li>
            </ul>

            <h2>11. CHANGES TO THIS SLA</h2>
            <h3>11.1 Modifications</h3>
            <p>We may modify this SLA with:</p>
            <ul>
                <li>30 days' advance notice</li>
                <li>Posted updates on our website</li>
                <li>Email notification to active clients</li>
            </ul>

            <h3>11.2 Material Changes</h3>
            <p>For material reductions in service levels:</p>
            <ul>
                <li>60 days' notice</li>
                <li>Option to terminate without penalty</li>
            </ul>

            <h2>12. LIMITATIONS</h2>
            <h3>12.1 Best Efforts</h3>
            <p>While we commit to these service levels, they represent targets, not absolute guarantees.</p>

            <h3>12.2 No Warranties</h3>
            <p>This SLA does not provide warranties beyond those in the Terms of Service.</p>

            <h3>12.3 Force Majeure</h3>
            <p>We are not liable for SLA breaches caused by events beyond our reasonable control.</p>

            <h2>13. CONTACT INFORMATION</h2>
            <p>For SLA-related inquiries:</p>
            <ul>
                <li>Service Level Management: Email: support@thenoveltyconcepts.com Phone: +233 20 021 7444</li>
                <li>Technical Support: Email: support@thenoveltyconcepts.com Phone: +233 20 021 7444</li>
            </ul>
        </div>
    );
}
