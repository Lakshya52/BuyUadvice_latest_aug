import React from 'react'
import PageHeader from '../components/PageHeader'

const Terms = () => {
  return (
    <>
      <PageHeader
        heading="Terms & Conditions"
        paragraph="Please read these terms and conditions carefully before using our platform and services."
      />

      <div className="w-full px-25 py-16 flex justify-center">
        <div className="max-w-360 flex flex-col gap-10">

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#475569] text-[19px] leading-[1.8]">
              By accessing and using BuyUadvice ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, you must not use our services. We reserve the right to modify these terms at any time, and continued use of the Platform constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">2. Services Description</h2>
            <p className="text-[#475569] text-[19px] leading-[1.8]">
              BuyUadvice provides a platform that connects users with qualified tax, legal, and compliance professionals. Our services include but are not limited to business registration, GST filing, income tax return filing, trademark registration, and other regulatory compliance services. We act as an intermediary between clients and service providers.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">3. User Responsibilities</h2>
            <p className="text-[#475569] text-[19px] leading-[1.8]">
              Users are responsible for providing accurate and complete information when using our services. You must ensure that all documents, data, and details submitted through the Platform are truthful and up-to-date. Users are solely responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">4. Payment Terms</h2>
            <p className="text-[#475569] text-[19px] leading-[1.8]">
              All fees for services rendered through the Platform are due as specified at the time of service selection. Payments are non-refundable unless otherwise stated. We reserve the right to change our pricing at any time, and updated fees will be communicated before any new charges are applied.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">5. Intellectual Property</h2>
            <p className="text-[#475569] text-[19px] leading-[1.8]">
              All content on the Platform, including text, graphics, logos, icons, images, and software, is the property of BuyUadvice or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">6. Limitation of Liability</h2>
            <p className="text-[#475569] text-[19px] leading-[1.8]">
              BuyUadvice shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our Platform or services. While we strive to connect users with qualified professionals, we do not guarantee the accuracy, completeness, or reliability of any advice or service provided through the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">7. Indemnification</h2>
            <p className="text-[#475569] text-[19px] leading-[1.8]">
              Users agree to indemnify, defend, and hold harmless BuyUadvice, its directors, employees, and agents from any claims, losses, damages, liabilities, costs, and expenses arising out of or related to your use of the Platform or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">8. Termination</h2>
            <p className="text-[#475569] text-[19px] leading-[1.8]">
              We reserve the right to suspend or terminate your access to the Platform at any time, without prior notice, for conduct that we determine violates these Terms or is harmful to other users, third parties, or the business interests of BuyUadvice.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">9. Governing Law</h2>
            <p className="text-[#475569] text-[19px] leading-[1.8]">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in India.
            </p>
          </section>

          <section>
            <h2 className="text-[25px] font-semibold text-(--color-primary) mb-4">10. Contact Information</h2>
            <p className="text-[#475569] text-[19px] leading-[1.8]">
              If you have any questions about these Terms and Conditions, please contact us at support@buyuadvice.com.
            </p>
          </section>

          <p className="text-[#94a3b8] text-[14px] mt-4">Last updated: August 2026</p>

        </div>
      </div>
    </>
  )
}

export default Terms
