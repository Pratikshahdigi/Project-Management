import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agency OS - The Complete Self-Hosted Suite',
  description: 'Enterprise agency management system replacing ClickUp, Asana, Tuesday, Jira, and HubSpot.',
  keywords: 'agency software, self-hosted agency CRM, project management, client portal, local LLM, social media scheduler',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-darkBg text-zinc-100">
        {children}
      </body>
    </html>
  );
}
