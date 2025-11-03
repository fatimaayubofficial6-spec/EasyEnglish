import Link from "next/link";

export function Footer() {
  return (
    <footer className="glass border-t border-border/40">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="gradient-text text-lg font-semibold">EasyEnglish</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Your journey to mastering English starts here.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/lessons"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Lessons
                </Link>
              </li>
              <li>
                <Link
                  href="/practice"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Practice
                </Link>
              </li>
              <li>
                <Link
                  href="/progress"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Progress
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/ui-kit"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  UI Kit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EasyEnglish. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
