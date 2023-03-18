import "./globals.css";
import Nav from "../components/nav/Nav";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Highlighters",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
