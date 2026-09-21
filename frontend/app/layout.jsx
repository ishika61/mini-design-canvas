import './globals.css';

export const metadata = {
  title: 'Mini Design Canvas',
  description: 'A lightweight canvas editor built with React Konva',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
