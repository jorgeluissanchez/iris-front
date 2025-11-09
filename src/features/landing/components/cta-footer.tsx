'use client';

import { IrisLogo } from './iris-logo';
import { landingContent } from '../content';


export function Footer() {
  return (
    <footer className="relative z-10 px-6 py-12 md:px-12 border-t border-border/30 glass-effect">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <IrisLogo size={32} />
              <span className="text-2xl font-bold prismatic-text">{landingContent.footer.brand}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              {landingContent.footer.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{landingContent.footer.navigation.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {landingContent.footer.navigation.links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{landingContent.footer.contact.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {landingContent.footer.contact.links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {landingContent.footer.copyright}
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {landingContent.footer.legal.map((link, index) => (
              <a key={index} href={link.href} className="hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
