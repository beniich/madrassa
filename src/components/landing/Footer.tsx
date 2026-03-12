import { GraduationCap, Sparkles, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const links = {
    product: [
      { name: "Fonctionnalités", href: "#features" },
      { name: "Modules IA", href: "#ai" },
      { name: "Tarifs", href: "#pricing" },
      { name: "Roadmap", href: "#roadmap" },
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Webinaires", href: "#" },
      { name: "Case Studies", href: "#" },
    ],
    company: [
      { name: "À propos", href: "#" },
      { name: "Carrières", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Partenaires", href: "#" },
    ],
    legal: [
      { name: "CGU", href: "#" },
      { name: "Confidentialité", href: "#" },
      { name: "RGPD", href: "#" },
      { name: "Cookies", href: "#" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <GraduationCap className="h-8 w-8 text-primary" />
                <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
              </div>
              <span className="font-bold text-xl text-gradient">SchoolGenius</span>
            </a>
            <p className="text-muted-foreground text-sm mb-6">
              La plateforme de gestion scolaire propulsée par l'IA qui transforme 
              l'éducation, un établissement à la fois.
            </p>
            <div className="space-y-2">
              <a href="mailto:contact@schoolgenius.fr" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                contact@schoolgenius.fr
              </a>
              <a href="tel:+33123456789" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                01 23 45 67 89
              </a>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Paris, France 🇫🇷
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Produit</h4>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Ressources</h4>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Entreprise</h4>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Légal</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 SchoolGenius. Fait avec ❤️ et beaucoup de ☕ en France.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-2xl hover:scale-110 transition-transform cursor-pointer">🐦</span>
            <span className="text-2xl hover:scale-110 transition-transform cursor-pointer">💼</span>
            <span className="text-2xl hover:scale-110 transition-transform cursor-pointer">📸</span>
            <span className="text-2xl hover:scale-110 transition-transform cursor-pointer">📺</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
