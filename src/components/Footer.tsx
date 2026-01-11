import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconSchool,
} from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="bg-base-300/50 border-t border-primary backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xl mb-4">
              <IconSchool size={32} />
              <span>Shiksha</span>
            </div>
            <p className="text-base-content/80 mb-4 max-w-md">
              AI-powered platform to prevent student dropouts through real-time
              monitoring and comprehensive support systems.
            </p>
            <div className="flex gap-4">
              {[IconBrandGithub, IconBrandTwitter, IconBrandLinkedin].map(
                (Icon, index) => {
                  const href = "";
                  return (
                    <a
                      key={index}
                      href={href}
                      className="text-base-content/80 hover:text-primary transition-colors"
                    >
                      <Icon size={32} />
                    </a>
                  );
                }
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base-content mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["About", "Features", "How It Works", "Contact"].map(
                (link, index) => {
                  const href = `#${link.toLowerCase().replace(/ /g, "-")}`;
                  return (
                    <li key={index}>
                      <a
                        href={href}
                        className="text-base-content/80 hover:text-primary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  );
                }
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-base-content mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                "Documentation",
                "Support",
                "Privacy Policy",
                "Terms of Service",
              ].map((link, index) => {
                const href = "#";
                return (
                  <li key={index}>
                    <a
                      href={href}
                      className="text-base-content/80 hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="border-t border-primary/60 py-2 text-center text-base-content/80 animate-pulse">
          <p>&copy; {new Date().getFullYear()} Shiksha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
