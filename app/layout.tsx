import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/components/dashboard/navbar'
import { Poppins } from "next/font/google"

const poppins = Poppins({
  weight: ["400","500", "700"],
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${poppins.className}`}>
        <body className={poppins.className}>
          <Navbar/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}