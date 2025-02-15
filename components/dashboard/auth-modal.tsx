"use client"

import { SignIn, SignUp } from "@clerk/nextjs"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "signIn" | "signUp"
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0">
        {mode === "signIn" ? <SignIn signUpUrl="#" routing="hash" /> : <SignUp signInUrl="#" routing="hash" />}
      </DialogContent>
    </Dialog>
  )
}

