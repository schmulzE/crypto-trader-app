"use client"

import Link from "next/link"
import { useState } from "react"
import AuthModal from "./auth-modal"
import { Button } from "../ui/button"
import { useAuth, UserButton,useUser } from "@clerk/nextjs"
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { TwitterLogoIcon, GitHubLogoIcon, PersonIcon, HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons"

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Function to get user initials from full name
  const getUserInitials = () => {
    if (!user?.fullName) return "?"
    return user.fullName
      .split(" ")
      .map((name: string) => name[0])
      .join("")
      .toUpperCase()
  }

  const MobileMenu = () => (
    <div className="md:hidden fixed inset-0 bg-white z-50 p-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsMobileMenuOpen(false)} className="p-2" variant={'ghost'}>
          <Cross1Icon className="w-6 h-6" />
        </Button>
      </div>
      <div className="flex flex-col items-center gap-6 mt-8">
        <Link 
          href="/" 
          className="text-xl font-bold"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          CoinTrader
        </Link>
        <div className="flex gap-4">
          <TwitterLogoIcon className="w-6 h-6" />
          <GitHubLogoIcon className="w-6 h-6" />
        </div>
        {isSignedIn ? (
          <>
            <UserButton />
          </>
        ) : (
          <div className="flex flex-col gap-4 w-full px-4">
            <Button
              onClick={() => {
                setIsSignInOpen(true)
                setIsMobileMenuOpen(false)
              }}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white"
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                setIsSignUpOpen(true)
                setIsMobileMenuOpen(false)
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <nav className="bg-white text-gray-900 p-4">
      <div className="flex justify-between items-center mx-auto">
        <Link href="/" className="text-xl font-bold font-roboto">
          CoinTrader
        </Link>

         {/* Mobile menu button */}
         <Button
          variant={'ghost'}
          size={'icon'}
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <HamburgerMenuIcon className="w-8 h-8" />
        </Button>

        <div className="hidden md:flex items-center">
          <div className="inline-flex gap-x-4 items-center">
            <TwitterLogoIcon className='w-5 h-5' />
            <GitHubLogoIcon className='w-5 h-5' />
          </div>
          {isSignedIn ? (
            <>
              <UserButton />
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsSignInOpen(true)}
                className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded item-end ml-4"
              >
                Sign In
              </Button>
              {/* <Button
                onClick={() => setIsSignUpOpen(true)}
                className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded mr-2"
              >
                Get Started 
              </Button> */}
            </>
          )}

          <UserButton/>
          {/* {isSignedIn && isLoaded && isSignedIn ? (
            <Avatar>
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar>
              <AvatarImage />
              <AvatarFallback>
                <PersonIcon className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          )} */}
        </div>
      </div>

       {/* Mobile menu overlay */}
       {isMobileMenuOpen && <MobileMenu />}

      <AuthModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} mode="signIn" />
      <AuthModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} mode="signUp" />
    </nav>
  )
}
