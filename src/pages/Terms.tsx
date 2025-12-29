import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-4">Updated: October 3, 2025</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-gold">
              Terms of Use
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome to Uaicode, your trusted partner at the forefront of Artificial Intelligence and business automation. By accessing our website "www.uaicode.ai" and using the various services we offer, you are entering into a commitment governed by these Terms of Use. Every step you take on our website, every service you explore or use, is subject to these guidelines, designed to ensure a safe, productive, and enjoyable experience for all our users.
            </p>
          </div>

          {/* Content Sections */}
          <div className="glass-card p-8 md:p-12 space-y-12">
            {/* Scope of Terms */}
            <section className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">Scope of Terms</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Applicability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms of Use apply to all interactions on the Uaicode website, including, but not limited to, browsing, using tools, downloading content, participating in forums, subscribing to newsletters, and using AI and automation services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Agreement</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    By using the Uaicode website, you automatically agree to these Terms, which act as a legal contract between you and Uaicode. If, for any reason, you disagree with any part of these Terms, your only option is to discontinue using the website and the services offered.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Updates and Changes</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The Terms of Use may be updated periodically to reflect new legal practices, changes to the services, or user feedback. We recommend that you review these Terms regularly to stay informed of any changes.
                  </p>
                </div>
              </div>
            </section>

            {/* Use of Services */}
            <section className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">Use of Services</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Access</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The Uaicode website is intended for users seeking innovative AI and business automation solutions. Access to and use of the website must comply with these Terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Content</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All content on the website (text, graphics, images, software) is the property of Uaicode and protected by copyright and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">User Conduct</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You agree not to use the website for any unlawful purpose or for any purpose prohibited by these Terms. This includes, but is not limited to, violating the privacy of others, publishing defamatory content, or fraudulently using the services.
                  </p>
                </div>
              </div>
            </section>

            {/* Rights and Restrictions */}
            <section className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">Rights and Restrictions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Limited License</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We grant you a limited, non-exclusive, and revocable license to access the website and use our services as set forth in these Terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Restrictions</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You may not copy, modify, distribute, sell, or rent any part of our services or included software, nor may you reverse engineer or attempt to extract the source code of the software.
                  </p>
                </div>
              </div>
            </section>

            {/* Responsibilities */}
            <section className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">Responsibilities</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">From Uaicode</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We strive to keep the website up to date and operational, but we do not guarantee that it will be free from interruptions or errors.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">From the User</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The user is responsible for maintaining the confidentiality of their account and password information and for all activities performed under their account.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">Limitation of Liability</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                It is essential to understand that, in the context of the services offered by Uaicode, our legal liability is limited. Uaicode, including its directors, employees, partners, and affiliates, will not be liable for any damages not directly or clearly caused by our actions or omissions. This limitation includes, but is not limited to:
              </p>

              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc list-inside pl-4">
                <li><strong>Indirect Damages:</strong> Any damages that are not a direct result of the use of our services or failure to comply with these Terms, including actions taken based on the information or services we offer.</li>
                <li><strong>Incidental Damages:</strong> Damages that occur accidentally and are not a direct consequence of the use of our services, but may be related in some way.</li>
                <li><strong>Special or Consequential Damages:</strong> These are damages that may occur as a result of special circumstances that go beyond what is normal or expected.</li>
                <li><strong>Punitive Damages:</strong> Uaicode will not be liable for damages intended to punish or deter conduct, even if such conduct is related to the use of our services.</li>
                <li><strong>Lost Profits:</strong> We will not be liable for any lost profits that you or third parties may suffer related to our services.</li>
                <li><strong>Lost Revenue:</strong> Similarly, lost revenue, whether direct or indirect, is not covered by our liability.</li>
                <li><strong>Loss of Data:</strong> Any data lost or damaged during the use of our services is not our responsibility, except in cases where such loss is directly caused by proven negligence on our part.</li>
                <li><strong>Loss of Use:</strong> We are not responsible for any loss of use of our services or inability to use our services.</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed mt-4">
                This limitation of liability is a fundamental part of the agreement between Uaicode and the user. It applies regardless of whether the claim is based on contract, tort, negligence, strict liability, or any other legal basis, even if Uaicode is advised of the possibility of such damages.
              </p>
            </section>

            {/* Change of Terms */}
            <section className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">Change of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                Uaicode reserves the right to modify these Terms at any time. Changes will take effect immediately upon posting on the website.
              </p>
            </section>

            {/* Contact Information */}
            <section className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-gradient-gold">Contact</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms, please contact us at:{" "}
                  <a href="mailto:hello@uaicode.ai" className="text-accent hover:text-accent/80 transition-colors">
                    hello@uaicode.ai
                  </a>
                </p>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Address</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Uaicode Data & AI Solutions LLC<br />
                    6751 Forum Drive, Suite 240<br />
                    Orlando, FL 32821
                  </p>
                </div>
              </div>
            </section>

            {/* Final Agreement */}
            <section className="animate-fade-in pt-8 border-t border-border">
              <p className="text-muted-foreground leading-relaxed italic">
                By using the Uaicode website, you acknowledge that you have read, understood and agreed to be bound by these Terms.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
