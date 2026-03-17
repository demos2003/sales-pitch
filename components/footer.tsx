import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Panmae</h3>
            <p className="text-sm text-muted-foreground">
              Connecting passionate founders with talented tech creatives to build innovative products.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">For Founders</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/for-founders" className="text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/create-project" className="text-muted-foreground hover:text-foreground">
                  Create a Project
                </Link>
              </li>
              {/* Success stories area lives on the main landing when validation mode is off */}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">For Creatives</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/for-creatives" className="text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-foreground">
                  Find Projects
                </Link>
              </li>
              <li>
                <Link href="/build-portfolio" className="text-muted-foreground hover:text-foreground">
                  Build Your Portfolio
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Panmae. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
