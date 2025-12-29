import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-4">Updated: October 3, 2025</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-gold">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This document clarifies data collection on the website "www.uaicode.ai," owned by Uaicode Data & AI Solutions LLC.
            </p>
          </div>

          <div className="glass-card p-8 md:p-12 space-y-12">
            <section>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This Policy details the collection, use, sharing, and storage of data by our website and related services. Please read it carefully to understand our commitment to the security of your data. Acceptance of this Policy occurs when you register to use our services, including free services. You acknowledge and agree to the use of your collected data.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Questions or suggestions can be sent to <a href="mailto:hello@uaicode.ai" className="text-accent hover:text-accent/80 transition-colors">hello@uaicode.ai</a>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Headquarters: Uaicode Data & AI Solutions LLC, 6751 Forum Drive, Suite 240, Orlando, FL 32821.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">
                Data Collection and Personal Data
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you fill out forms on our website, contact us, receive newsletters, and downloads, we collect personal data to provide you with appropriate service. We may contact you by email or phone for support, surveys, news, promotions, products and services, or to comply with legal obligations. You can request the deletion or modification of your data at any time and unsubscribe from receiving messages.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We monitor the website to ensure compliance with the Policy and reserve the right to exclude users who do not comply. Personal data will be deleted upon request or upon fulfillment of its purpose, within the contractual term.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">
                Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect data via cookies, files on your computer or mobile device, to analyze website behavior and improve navigation. Types of cookies used:
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc list-inside pl-4">
                <li>First-party cookies: Recognize repeat visits to our website;</li>
                <li>Third-party cookies: External services on our website also identify visits to our website and other websites. Cookies may expire when you close your browser or remain indefinite.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">
                Advanced Analytics with Google Analytics at Uaicode
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At Uaicode, we use Google Analytics to continually improve the user experience on our website. This powerful analytics tool allows us to collect and analyze anonymous information, ensuring more intuitive navigation and content aligned with our visitors' preferences.
              </p>

              <h3 className="text-xl font-semibold mb-4">
                Detailing the collected data
              </h3>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>IP Address:</strong> Essential for understanding the geographic location of our visitors, helping to optimize website availability in different regions.
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Geographic Location:</strong> Allows us to identify market trends in specific areas, improving marketing strategies and localized content.
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Referral Source:</strong> Reveals how users reach our website, whether through search engines, social media, or direct links, crucial for understanding the impact of our digital marketing campaigns.
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Browser Type:</strong> Understanding the most commonly used browsers helps ensure our website offers a more consistent user experience across all platforms.
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Visit duration and pages viewed:</strong> This data is vital for understanding user behavior on the website, allowing us to optimize the structure and content to better engage visitors.
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                This data is analyzed with respect for user privacy and anonymity. With this information, we can:
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc list-inside pl-4 mb-6">
                <li>Improve website usability by ensuring more fluid and intuitive navigation;</li>
                <li>Develop more relevant and personalized content and offers;</li>
                <li>Identify opportunities for improvement and innovation in our services and interface.</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed">
                Google Analytics is an essential tool in our continuous improvement strategy, aligning our digital platform with the needs and expectations of our users. This process reflects our commitment to excellence and innovation in the digital age. By visiting www.uaicode.ai, you contribute to this cycle of continuous improvement, enabling us to offer an increasingly personalized and effective experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">
                Third-Party Media Management at Uaicode
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At Uaicode, we recognize the importance of dynamic and varied content, which is why we frequently embed third-party media on our website. This includes videos, images, articles, and other forms of digital content from external sources. And how does it work?
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                When you access a page on our website that contains embedded third-party media, you may be indirectly interacting with the original website. This external content maintains its own privacy and data collection policy, independent of Uaicode. When you interact with this media, information such as your IP address, the pages visited on our website, and other related actions may be collected by the media's originating website.
              </p>

              <h3 className="text-xl font-semibold mb-4">
                Important Considerations
              </h3>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Independent Policies:</strong> The privacy and data collection policies of third-party websites are separate and independent from those of Uaicode. We recommend that you review these policies to understand how your data is managed.
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Monitoring and Tracking:</strong> Some of these websites may use cookies, additional tracking, and monitor your interaction with embedded content, especially if you have an account and are logged in to the website.
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Commitment to Security:</strong> Although we embed third-party content, Uaicode makes an ongoing effort to choose reliable and secure sources. However, the data management of these websites is your sole responsibility.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">
                Our Guidance to Users
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We encourage our visitors to be aware of these practices when interacting with embedded media. We are committed to providing relevant and enriching content, but we also want to ensure that you are informed about how your information may be used by third parties. At Uaicode, we value transparency and empowering users to make informed choices about how they interact with our website and the content available.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">
                Access to Personal Data
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Only authorized Uaicode employees access your data. Authorized partners may have access in the event of partnerships. We do not disclose data publicly without authorization. We make every effort to protect systems and data. Data is retained until necessary or relevant for the purposes of this Policy, in compliance with the law.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Despite our efforts, we cannot guarantee complete security against unauthorized access. We will report any security incidents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">
                Data Sharing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Users have the right to access, cancel, modify, and clarify their data. Contact us at <a href="mailto:hello@uaicode.ai" className="text-accent hover:text-accent/80 transition-colors">hello@uaicode.ai</a> to exercise your rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">
                Consent to Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Registering on our website implies acceptance of this Policy. If you disagree, do not proceed with registration and do not use the services. Without personal data, we will not provide services. We welcome any disagreements to improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">
                Policy Update
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                This Policy may be updated. We recommend visiting it periodically to review any changes. New authorizations will be requested if there are significant changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">
                Questions and Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Contact us to clarify any questions about this Policy. Email: <a href="mailto:hello@uaicode.ai" className="text-accent hover:text-accent/80 transition-colors">hello@uaicode.ai</a>
              </p>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Uaicode Data & AI Solutions LLC</strong><br />
                  6751 Forum Drive, Suite 240<br />
                  Orlando, FL 32821<br />
                  Phone: +1 (321) 529 1451
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
