import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">SchoolGenius</span>
            </div>
            <p className="text-muted-foreground">
              La plateforme de gestion scolaire propulsée par l'IA qui transforme l'éducation.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@schoolgenius.fr</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> 01 23 45 67 89</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Légal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Mentions Légales</li>
              <li>Confidentialité</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          © 2024 SchoolGenius. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
