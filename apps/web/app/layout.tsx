import type { Metadata } from "next";
import Link from "next/link";
import project from "../../../project.json";
import "@starter/ui/tokens.css";
import "@starter/ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: project.title, template: `%s · ${project.title}` },
  description: project.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><Link className="wordmark" href="/">{project.title}<span aria-hidden="true">.</span></Link>
      <nav aria-label="Main"><Link href="/">Overview</Link><Link href="/design-system">Design system</Link></nav>
    </header>
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="site-footer">A clear starting point. Yours to shape.</footer>
  </body></html>;
}
