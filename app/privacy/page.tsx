export default function PrivacyPage() {
  return (
    <main className="pt-32 pb-20 px-8 max-w-3xl mx-auto">
      <span className="font-label text-primary tracking-[0.3em] uppercase text-[10px] mb-6 block">
        Legal
      </span>
      <h1 className="font-headline text-5xl font-bold tracking-tighter mb-4">
        Privacy Policy
      </h1>
      <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-16">
        Last updated: March 2026
      </p>

      <div className="space-y-12 font-body text-on-surface-variant leading-relaxed">

        <section>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">1. Who We Are</h2>
          <p>
            Plan Metric is operated by Peter John Hamill, trading as Plan Metric, Queensland,
            Australia. We are committed to protecting your personal information in accordance
            with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
          </p>
          <p className="mt-4">
            If you have any questions about this policy, contact us at{" "}
            <a href="mailto:admin@planmetric.com.au" className="text-primary hover:underline">
              admin@planmetric.com.au
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">2. What Information We Collect</h2>
          <p>We collect the following types of personal information:</p>
          <ul className="mt-4 space-y-3 list-none">
            <li className="flex gap-3">
              <span className="text-primary font-bold">—</span>
              <span><strong className="text-on-surface">Identity information:</strong> Your name and email address when you purchase a plan or contact us.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">—</span>
              <span><strong className="text-on-surface">Payment information:</strong> Processed securely by our payment provider. We do not store your card details.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">—</span>
              <span><strong className="text-on-surface">Training and health data:</strong> Information you provide in our intake form, including fitness history, heart rate zones, weekly training volume, injury history, and goals.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">—</span>
              <span><strong className="text-on-surface">Strava data:</strong> If you connect your Strava account, we access your activity history solely to build your training plan. We do not store or share this data beyond that purpose.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">—</span>
              <span><strong className="text-on-surface">Usage data:</strong> Basic analytics on how you interact with our website (pages visited, time on site). This is anonymised and used only to improve the site.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">3. How We Use Your Information</h2>
          <p>We use your personal information only for the following purposes:</p>
          <ul className="mt-4 space-y-2 list-none">
            <li className="flex gap-3"><span className="text-primary font-bold">—</span><span>To build and deliver your personalised training plan</span></li>
            <li className="flex gap-3"><span className="text-primary font-bold">—</span><span>To process your payment and send order confirmations</span></li>
            <li className="flex gap-3"><span className="text-primary font-bold">—</span><span>To communicate with you about your plan or support queries</span></li>
            <li className="flex gap-3"><span className="text-primary font-bold">—</span><span>To improve our services and website</span></li>
            <li className="flex gap-3"><span className="text-primary font-bold">—</span><span>To comply with legal obligations</span></li>
          </ul>
          <p className="mt-4">
            We will not use your information for marketing without your explicit consent.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">4. Sharing Your Information</h2>
          <p>
            We do not sell, rent, or trade your personal information. We may share it only with:
          </p>
          <ul className="mt-4 space-y-3 list-none">
            <li className="flex gap-3">
              <span className="text-primary font-bold">—</span>
              <span><strong className="text-on-surface">Payment processors</strong> (e.g. Stripe) to handle transactions securely.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">—</span>
              <span><strong className="text-on-surface">Specialists</strong> engaged by Plan Metric to review your plan — bound by the same confidentiality obligations.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">—</span>
              <span><strong className="text-on-surface">Legal authorities</strong> if required by law.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">5. Health Information</h2>
          <p>
            Some information you provide (injury history, heart rate data, physiological metrics)
            is considered sensitive information under the Privacy Act. We collect this solely to
            build your training plan and handle it with a higher standard of care. It is never
            shared with third parties except as described in Section 4.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">6. Data Storage and Security</h2>
          <p>
            Your data is stored securely on Australian or international servers with appropriate
            safeguards. We use industry-standard security measures to protect your information
            from unauthorised access, loss, or disclosure. We retain your data for as long as
            necessary to provide our services and comply with legal obligations.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="mt-4 space-y-2 list-none">
            <li className="flex gap-3"><span className="text-primary font-bold">—</span><span>Access the personal information we hold about you</span></li>
            <li className="flex gap-3"><span className="text-primary font-bold">—</span><span>Request correction of inaccurate information</span></li>
            <li className="flex gap-3"><span className="text-primary font-bold">—</span><span>Request deletion of your information (subject to legal retention requirements)</span></li>
            <li className="flex gap-3"><span className="text-primary font-bold">—</span><span>Withdraw consent for any optional use of your data</span></li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, email{" "}
            <a href="mailto:admin@planmetric.com.au" className="text-primary hover:underline">
              admin@planmetric.com.au
            </a>. We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">8. Cookies</h2>
          <p>
            Our website uses minimal cookies for basic functionality and anonymised analytics.
            We do not use advertising or tracking cookies. You can disable cookies in your browser
            settings, though this may affect some site functionality.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">9. Third-Party Links</h2>
          <p>
            Our website may link to third-party sites such as Instagram or Strava. We are not
            responsible for the privacy practices of those sites and encourage you to review
            their policies directly.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">10. Complaints</h2>
          <p>
            If you believe we have mishandled your personal information, please contact us first
            at admin@planmetric.com.au. If you are not satisfied with our response, you may
            lodge a complaint with the Office of the Australian Information Commissioner (OAIC)
            at{" "}
            <a
              href="https://www.oaic.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              www.oaic.gov.au
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated date. Continued use of our services after changes are posted
            constitutes acceptance of the revised policy.
          </p>
        </section>

      </div>
    </main>
  );
}
