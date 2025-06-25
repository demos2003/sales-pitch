"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InterestSelectionModal } from "./interest-selection-modal"
import { useRouter } from "next/navigation"

interface FirstLoginModalProps {
  isOpen: boolean
  onComplete: () => void
}

export function FirstLoginModal({ isOpen, onComplete }: FirstLoginModalProps) {
  const [step, setStep] = useState(1)
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const router = useRouter()

  const handleNext = () => {
    if (step === 1) {
      setShowInterestModal(true)
    } else if (step === 2) {
      router.push("/profile/settings")
    } else {
      onComplete()
    }
  }

  const handleInterestsSave = (interests: string[]) => {
    setSelectedInterests(interests)
    setShowInterestModal(false)
    setStep(2)
  }

  const handleSkip = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  return (
    <>
      <Dialog open={isOpen && !showInterestModal} onOpenChange={(open) => !open && onComplete()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {step === 1
                ? "Welcome to Sales Pitch!"
                : step === 2
                  ? "Complete Your Profile"
                  : "Find Your First Project"}
            </DialogTitle>
            <DialogDescription>
              {step === 1
                ? "Let's set up your account to help you find the perfect projects to contribute to."
                : step === 2
                  ? "Add more details to your profile to stand out to project founders."
                  : "Browse available projects that match your skills and interests."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {step === 1 && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Select Your Tech Interests</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tell us what technologies and areas you're interested in to help us recommend relevant projects.
                  </p>
                  <Button onClick={() => setShowInterestModal(true)}>Select Interests</Button>
                </div>
                {selectedInterests.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    ✓ You've selected {selectedInterests.length} interests
                  </p>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Complete Your Profile</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your skills, experience, and upload your resume to increase your chances of being selected for
                    projects.
                  </p>
                  <Button onClick={() => router.push("/profile/settings")}>Edit Profile</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Explore Projects</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse through projects that match your interests and apply to ones that excite you.
                  </p>
                  <Button onClick={() => router.push("/projects")}>Find Projects</Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button variant="ghost" onClick={handleSkip}>
                {step < 3 ? "Skip for now" : "Maybe later"}
              </Button>
              <Button onClick={handleNext} disabled={step === 1 && selectedInterests.length === 0}>
                {step < 3 ? "Next" : "Finish"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InterestSelectionModal
        isOpen={showInterestModal}
        onClose={() => setShowInterestModal(false)}
        onSave={handleInterestsSave}
        selectedInterests={selectedInterests}
        isFirstLogin={true}
      />
    </>
  )
}
