
import React from 'react';

export default function CookiePolicy() {
    return (
        <div>
            <h1>COOKIE POLICY</h1>
            <p>Last Updated: January 1, 2026</p>
            <p>This Cookie Policy explains how Novelty Concepts Ltd uses cookies and similar technologies on the Novelty Concepts Ltd HRM & Payroll System.</p>

            <h2>1. WHAT ARE COOKIES?</h2>
            <p>Cookies are small text files stored on your device (computer, smartphone, tablet) when you visit a website. They help websites remember your preferences, login status, and other information to improve your experience.</p>

            <h2>2. TYPES OF COOKIES WE USE</h2>
            <h3>2.1 Essential Cookies (Strictly Necessary)</h3>
            <p>These cookies are required for the System to function properly.</p>
            <p><strong>Purpose:</strong></p>
            <ul>
                <li>Maintain your login session</li>
                <li>Remember your authentication status</li>
                <li>Enable security features</li>
                <li>Maintain your language preference</li>
                <li>Support System functionality</li>
            </ul>
            <p><strong>Examples:</strong></p>
            <ul>
                <li>session_token - Keeps you logged in</li>
                <li>csrf_token - Protects against cross-site request forgery</li>
                <li>auth_user - Identifies your user account</li>
            </ul>
            <p><strong>Retention:</strong> Session (deleted when you log out) or up to 30 days</p>
            <p><strong>Can be disabled?</strong> No - the System will not work without these cookies.</p>

            <h3>2.2 Functional Cookies</h3>
            <p>These cookies enhance your experience by remembering your preferences.</p>
            <p><strong>Purpose:</strong></p>
            <ul>
                <li>Remember your display settings (theme, font size)</li>
                <li>Save your filter preferences</li>
                <li>Remember column arrangements in tables</li>
                <li>Store recently accessed pages</li>
                <li>Remember form inputs (to prevent data loss)</li>
            </ul>
            <p><strong>Examples:</strong></p>
            <ul>
                <li>user_preferences - Stores your settings</li>
                <li>dashboard_layout - Remembers your dashboard configuration</li>
                <li>table_columns - Remembers which columns you display</li>
            </ul>
            <p><strong>Retention:</strong> Up to 1 year</p>
            <p><strong>Can be disabled?</strong> Yes - but your preferences will not be saved between sessions.</p>

            <h3>2.3 Analytics Cookies</h3>
            <p>These cookies help us understand how the System is used so we can improve it.</p>
            <p><strong>Purpose:</strong></p>
            <ul>
                <li>Measure page views and feature usage</li>
                <li>Track user journeys through the System</li>
                <li>Identify performance issues</li>
                <li>Understand which features are most valuable</li>
                <li>Measure conversion rates (for recruitment module)</li>
            </ul>
            <p><strong>Examples:</strong></p>
            <ul>
                <li>_ga - Google Analytics (if used)</li>
                <li>analytics_session - Session tracking</li>
                <li>feature_usage - Feature usage tracking</li>
            </ul>
            <p><strong>Retention:</strong> Up to 2 years</p>
            <p><strong>Can be disabled?</strong> Yes - through cookie preferences.</p>

            <h3>2.4 Performance Cookies</h3>
            <p>These cookies monitor System performance and help us identify issues.</p>
            <p><strong>Purpose:</strong></p>
            <ul>
                <li>Measure page load times</li>
                <li>Identify slow-performing features</li>
                <li>Monitor error rates</li>
                <li>Detect browser compatibility issues</li>
            </ul>
            <p><strong>Retention:</strong> 90 days</p>
            <p><strong>Can be disabled?</strong> Yes - through cookie preferences.</p>

            <h2>3. THIRD-PARTY COOKIES</h2>
            <p>We use trusted third-party services that may set cookies on your device to enable specific features or provide us with analytics. These third parties include:</p>
            <ul>
                <li><strong>Google Cloud Platform:</strong> Used for hosting and infrastructure; may set cookies to manage traffic and ensure system stability.</li>
                <li><strong>Google Analytics:</strong> Helps us understand how users interact with the system to improve performance.</li>
                <li><strong>Email & SMS Providers:</strong> Services like SendGrid or Twilio may use tracking pixels or cookies to confirm delivery of system notifications.</li>
                <li><strong>Payment Processors:</strong> Third-party billing partners set cookies to securely process subscription payments and prevent fraud.</li>
            </ul>

            <h2>4. HOW TO CONTROL AND DELETE COOKIES</h2>
            <p>You have the right to decide whether to accept or reject cookies.</p>
            <ul>
                <li><strong>Cookie Preference Center:</strong> You can manage non-essential preferences (Functional, Analytics, Performance) directly through the "Cookie Settings" link in the system footer.</li>
                <li><strong>Browser Controls:</strong> Most web browsers allow you to block or delete cookies through their settings (e.g., Settings &gt; Privacy and Security).</li>
                <li><strong>Consequences of Disabling:</strong> Please note that Essential Cookies cannot be disabled as the system will not function without them. Disabling other categories may result in a loss of saved preferences (like language or theme).</li>
            </ul>

            <h2>5. DATA PROTECTION COMPLIANCE</h2>
            <p>In accordance with the Ghana Data Protection Act, 2012 (Act 843), we ensure that:</p>
            <ul>
                <li>We only use cookies for the specific purposes outlined in this policy.</li>
                <li>We obtain prior consent for non-essential cookies via our consent banner.</li>
                <li>Cookie data is stored securely and only for the durations specified in Section 2.</li>
            </ul>

            <h2>6. UPDATES TO THIS POLICY</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. Material changes will be notified via:</p>
            <ul>
                <li>An in-app notification upon your next login.</li>
                <li>An update to the "Last Updated" date at the top of this policy.</li>
            </ul>

            <h2>7. CONTACT US</h2>
            <p>If you have questions about our use of cookies, please contact our Data Protection Officer:</p>
            <ul>
                <li>Email: support@thenoveltyconcepts.com</li>
                <li>Phone: +233 20 021 7444</li>
                <li>Address: 59 Black Hoop Lane, Community 8, Tema, Ghana</li>
            </ul>
        </div>
    );
}
