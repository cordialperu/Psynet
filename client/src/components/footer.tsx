import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">PsycheConecta</h3>
            <p className="text-sm text-muted-foreground">
              Connecting seekers with authentic healing experiences in Peru.
            </p>
          </div>

          {/* Therapies */}
          <div>
            <h4 className="font-semibold mb-4">Therapies</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/explore?type=ayahuasca"><a className="hover:text-foreground transition-colors">Ayahuasca</a></Link></li>
              <li><Link href="/explore?type=san-pedro"><a className="hover:text-foreground transition-colors">San Pedro</a></Link></li>
              <li><Link href="/explore?type=kambo"><a className="hover:text-foreground transition-colors">Kambo</a></Link></li>
              <li><Link href="/explore?type=cacao-ceremony"><a className="hover:text-foreground transition-colors">Cacao Ceremony</a></Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {/* <li><Link href="/how-it-works"><a className="hover:text-foreground transition-colors">How It Works</a></Link></li> */}
              <li><a href="#" className="hover:text-foreground transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PsycheConecta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
