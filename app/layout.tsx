import './globals.css';
import Analytics from '../components/analytics'; // Import the component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Load Analytics component on all pages */}
        <Analytics />
      </body>
    </html>
  );
}
