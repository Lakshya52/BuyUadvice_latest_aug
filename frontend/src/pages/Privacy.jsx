import React from 'react'
import PageHeader from '../components/PageHeader'

const Privacy = () => {
  return (
    <>
      <PageHeader
        heading="Privacy Policy"
        paragraph="Your privacy is important to us. This policy explains how we collect, use, and protect your personal information."
      />

      <div className="w-full px-25 py-16 flex justify-center">
        <div className="max-w-360  flex flex-col gap-10">

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">1. Information We Collect</h2>
            <p className="text-(--color-gray) text-[19px] leading-[1.8]">
              We collect information you provide directly to us, including your name, email address, phone number, business details, and any documents or data you submit through our Platform. We also automatically collect certain information when you use our services, such as your IP address, browser type, device information, and usage data through cookies and similar technologies.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">2. How We Use Your Information</h2>
            <p className="text-(--color-gray) text-[19px] leading-[1.8]">
              We use the information we collect to provide, maintain, and improve our services, to process transactions and send related information, to send technical notices and support messages, to respond to your comments and questions, and to monitor and analyze trends, usage, and activities in connection with our Platform. We may also use your information to communicate with you about services, offers, and promotions.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">3. Information Sharing</h2>
            <p className="text-(--color-gray) text-[19px] leading-[1.8]">
              We do not sell your personal information to third parties. We may share your information with trusted service providers who assist us in operating our Platform and conducting our business, provided they agree to keep this information confidential. We may also disclose your information when required by law or to protect our rights, privacy, safety, or property.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">4. Data Security</h2>
            <p className="text-(--color-gray) text-[19px] leading-[1.8]">
              We implement industry-standard security measures to protect your personal information, including encryption, secure server infrastructure, and regular security audits. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">5. Data Retention</h2>
            <p className="text-(--color-gray) text-[19px] leading-[1.8]">
              We retain your personal information for as long as your account is active or as needed to provide you with services. We will also retain your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements. When your data is no longer needed, it will be securely deleted or anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">6. Cookies</h2>
            <p className="text-(--color-gray) text-[19px] leading-[1.8]">
              Our Platform uses cookies and similar tracking technologies to enhance your experience. Cookies are small data files stored on your device that help us recognize you and remember your preferences. You can control cookies through your browser settings, though disabling cookies may affect your ability to use certain features of our Platform.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">7. Your Rights</h2>
            <p className="text-(--color-gray) text-[19px] leading-[1.8]">
              You have the right to access, correct, or delete your personal information at any time. You can update your account information through your dashboard or by contacting us directly. You may also opt out of receiving promotional communications from us by following the unsubscribe instructions in those messages.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">8. Third-Party Links</h2>
            <p className="text-(--color-gray) text-[19px] leading-[1.8]">
              Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to read the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">9. Changes to This Policy</h2>
            <p className="text-(--color-gray) text-[19px] leading-[1.8]">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the Platform after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">10. Contact Us</h2>
            <p className="text-(--color-gray) text-[19px] leading-[1.8]">
              If you have any questions or concerns about this Privacy Policy, please contact us at support@buyuadvice.com.
            </p>
          </section>

          <p className="text-[#94a3b8] text-[14px] mt-4">Last updated: August 2026</p>

        </div>
      </div>
    </>
  )
}

export default Privacy
