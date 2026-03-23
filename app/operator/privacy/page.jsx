export const metadata = {
  title: 'Privacy Policy — The Operator',
  description: 'Privacy policy for The Operator app by Mainstream Movement Ltd.',
};

export default function OperatorPrivacyPage() {
  return (
    <div style={{
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      lineHeight: '1.6',
      color: '#1a1a1a',
      background: '#fafafa',
      margin: 0,
      padding: '2rem 1.5rem 4rem',
      minHeight: '100vh',
    }}>
      <style>{`
        @media (prefers-color-scheme: dark) {
          body { background: #111 !important; color: #e4e4e4 !important; }
          .wrap { color: #e4e4e4; }
          .wrap h2 { border-color: #333; }
          .wrap h3 { color: #9ca3af; }
          .wrap p, .wrap li { color: #e4e4e4; }
          .wrap hr { background: #333; }
          .wrap a { color: #60a5fa; }
          .muted { color: #9ca3af !important; }
        }
        * { box-sizing: border-box; }
        .wrap { max-width: 42rem; margin: 0 auto; }
        h1 { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.5rem; letter-spacing: -0.02em; }
        .muted { color: #555; font-size: 0.9rem; margin-bottom: 2.5rem; }
        h2 { font-size: 1.15rem; font-weight: 600; margin: 2.25rem 0 0.75rem; padding-bottom: 0.35rem; border-bottom: 1px solid #e0e0e0; }
        h3 { font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: #555; }
        p { margin: 0 0 0.75rem; }
        ul { margin: 0 0 1rem; padding-left: 1.5rem; }
        li { margin-bottom: 0.35rem; }
        a { color: #2563eb; text-decoration: none; }
        a:hover { text-decoration: underline; }
        hr { border: none; height: 1px; background: #e0e0e0; margin: 2rem 0; }
        .contact-email { font-weight: 600; word-break: break-all; }
      `}</style>

      <div className="wrap">
        <h1>Privacy Policy</h1>
        <p className="muted"><strong>Last updated:</strong> 11 February 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>This Privacy Policy explains how <strong>The Operator</strong> (&ldquo;the App&rdquo;) collects, uses, and protects information when you use the application.</p>
          <p>By using the App, you agree to this policy.</p>
        </section>

        <hr />

        <section>
          <h2>2. Information We Collect</h2>

          <h3>a) Camera Permission</h3>
          <p>The App may request access to your device camera.</p>
          <p>The camera is used solely for in-app functionality initiated by you. We do <strong>not</strong> record, store, or transmit camera footage unless explicitly required for the core functionality of the App and initiated by the user.</p>
          <p>We do not access the camera in the background.</p>

          <h3>b) Account Information</h3>
          <p>If you sign in using phone authentication (e.g. Firebase Authentication), we may collect:</p>
          <ul>
            <li>Phone number</li>
            <li>Authentication identifiers</li>
            <li>Basic account metadata</li>
          </ul>
          <p>This data is used solely for authentication and operation of the service.</p>

          <h3>c) Voice Communication Data</h3>
          <p>The App enables real-time audio communication using WebRTC technology.</p>
          <ul>
            <li>Audio is transmitted peer-to-peer or via secure servers.</li>
            <li>Calls are not recorded by default.</li>
            <li>We do not store call audio unless explicitly stated within the App.</li>
          </ul>

          <h3>d) Usage &amp; Technical Data</h3>
          <p>We may collect limited technical information such as:</p>
          <ul>
            <li>Device type</li>
            <li>Operating system version</li>
            <li>App version</li>
            <li>Crash logs</li>
          </ul>
          <p>This information is used to improve performance and reliability.</p>
        </section>

        <hr />

        <section>
          <h2>3. How We Use Information</h2>
          <p>We use collected data to:</p>
          <ul>
            <li>Provide core app functionality</li>
            <li>Authenticate users</li>
            <li>Enable voice communication</li>
            <li>Improve stability and performance</li>
            <li>Maintain platform security</li>
          </ul>
          <p>We do not sell personal data.</p>
        </section>

        <hr />

        <section>
          <h2>4. Data Storage &amp; Third Parties</h2>
          <p>We may use trusted third-party providers including:</p>
          <ul>
            <li>Firebase (Google LLC)</li>
            <li>Cloud hosting providers</li>
          </ul>
          <p>These services process data in accordance with their own privacy policies.</p>
        </section>

        <hr />

        <section>
          <h2>5. Data Sharing</h2>
          <p>We do not sell or rent user data.</p>
          <p>We may disclose information only:</p>
          <ul>
            <li>To service providers necessary to operate the App</li>
            <li>If required by law</li>
            <li>To protect the security or integrity of the service</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>6. Data Retention</h2>
          <p>We retain data only as long as necessary to provide the service or comply with legal obligations.</p>
        </section>

        <hr />

        <section>
          <h2>7. Your Rights</h2>
          <p>Depending on your jurisdiction (including UK GDPR), you may have rights to:</p>
          <ul>
            <li>Request access to your data</li>
            <li>Request correction or deletion</li>
            <li>Withdraw consent</li>
          </ul>
          <p>To exercise these rights, contact:</p>
          <p><a href="mailto:privacy@gomainstream.org" className="contact-email">privacy@gomainstream.org</a></p>
        </section>

        <hr />

        <section>
          <h2>8. Children&apos;s Privacy</h2>
          <p>The App is not intended for children under 13 (or the applicable legal age in your jurisdiction). We do not knowingly collect data from children.</p>
        </section>

        <hr />

        <section>
          <h2>9. Security</h2>
          <p>We implement reasonable technical and organisational safeguards. However, no system can guarantee absolute security.</p>
        </section>

        <hr />

        <section>
          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. Updates will be reflected by revising the &ldquo;Last updated&rdquo; date.</p>
        </section>

        <hr />

        <section>
          <h2>11. Contact</h2>
          <p>For privacy-related enquiries:</p>
          <p><a href="mailto:privacy@gomainstream.org" className="contact-email">privacy@gomainstream.org</a></p>
        </section>
      </div>
    </div>
  );
}
