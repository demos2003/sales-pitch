"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Tech interest categories
const TECH_INTERESTS = {
  "Web Development": [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "JavaScript",
    "React",
    "Vue.js",
    "Angular",
    "Node.js",
    "Next.js",
    "TypeScript",
    "PHP",
    "Ruby on Rails",
    "Django",
    "WordPress",
  ],
  "Mobile Development": [
    "iOS Development",
    "Android Development",
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "Mobile UI/UX",
    "App Store Optimization",
  ],
  "AI & Machine Learning": [
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Generative AI",
    "Data Science",
    "Neural Networks",
    "TensorFlow",
    "PyTorch",
    "Reinforcement Learning",
  ],
  "Blockchain & Web3": [
    "Blockchain Development",
    "Smart Contracts",
    "Ethereum",
    "Solidity",
    "NFTs",
    "DeFi",
    "Cryptocurrency",
    "Web3",
    "Decentralized Apps",
  ],
  "Design & UX": [
    "UI Design",
    "UX Design",
    "Product Design",
    "Graphic Design",
    "Interaction Design",
    "Design Systems",
    "Figma",
    "Adobe XD",
    "Sketch",
    "Prototyping",
  ],
  "DevOps & Cloud": [
    "DevOps",
    "AWS",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Infrastructure as Code",
    "Microservices",
    "Serverless",
  ],
  Data: [
    "Data Engineering",
    "Data Analysis",
    "Big Data",
    "SQL",
    "NoSQL",
    "Data Visualization",
    "ETL",
    "Data Warehousing",
    "Business Intelligence",
  ],
  "Game Development": [
    "Game Design",
    "Unity",
    "Unreal Engine",
    "3D Modeling",
    "Game Programming",
    "AR/VR Development",
    "Mobile Games",
  ],
  Security: [
    "Cybersecurity",
    "Ethical Hacking",
    "Security Auditing",
    "Penetration Testing",
    "Encryption",
    "Authentication",
    "Secure Coding",
  ],
  "Emerging Tech": [
    "IoT",
    "Robotics",
    "Quantum Computing",
    "Edge Computing",
    "5G Applications",
    "Biotechnology",
    "Clean Tech",
  ],
}

interface InterestSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (selectedInterests: string[]) => void
  selectedInterests: string[]
  isFirstLogin?: boolean
}

export function InterestSelectionModal({
  isOpen,
  onClose,
  onSave,
  selectedInterests = [],
  isFirstLogin = false,
}: InterestSelectionModalProps) {
  const [selected, setSelected] = useState<string[]>(selectedInterests)
  const [searchTerm, setSearchTerm] = useState("")
  const MAX_SKILLS = 20
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    isFirstLogin ? ["Web Development", "AI & Machine Learning"] : [],
  )

  // Reset selected interests when the modal opens
  useEffect(() => {
    if (isOpen) {
      setSelected(selectedInterests)
    }
  }, [isOpen, selectedInterests])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleInterestToggle = (interest: string) => {
    setSelected(prevSelected => {
      if (prevSelected.includes(interest)) {
        // If already selected, remove it
        return prevSelected.filter(i => i !== interest);
      } else if (prevSelected.length < MAX_SKILLS) {
        // Only add if under the limit
        return [...prevSelected, interest];
      }
      // If at limit, don't add
      return prevSelected;
    });
  }

  const handleSave = () => {
    onSave(selected);
  }

  // Filter interests based on search query
  const filteredInterests = Object.entries(TECH_INTERESTS).map(([category, interests]) => ({
    category,
    interests: interests.filter((interest) =>
      interest.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  }))

  const selectedCount = selectedInterests.length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isFirstLogin ? "Select Your Tech Skills" : "Edit Your Skills"}
          </DialogTitle>
          <DialogDescription>
            {isFirstLogin
              ? `Select up to ${MAX_SKILLS} skills that best represent your expertise. This helps us match you with relevant projects.`
              : `Update your skills to refine your project recommendations. (${selectedCount}/${MAX_SKILLS} selected)`}
          </DialogDescription>
          {selectedCount >= MAX_SKILLS && (
            <div className="text-sm text-amber-600 dark:text-amber-400">
              You've reached the maximum number of skills. Remove some to add others.
            </div>
          )}
        </DialogHeader>

        <div className="sticky top-0 bg-background z-10 pb-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search interests..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4 -mr-4 -ml-1">
          <div className="space-y-6">
            {filteredInterests.map(({ category, interests }) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center cursor-pointer" onClick={() => toggleCategory(category)}>
                  <h3 className="text-lg font-medium flex-1">{category}</h3>
                  <span className="text-sm text-muted-foreground">
                    {expandedCategories.includes(category) ? "Hide" : "Show"}
                  </span>
                </div>

                {expandedCategories.includes(category) && (
                  <div className="grid grid-cols-2 gap-2 ml-2 mt-2">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={selected.includes(interest)}
                          onCheckedChange={() => handleInterestToggle(interest)}
                          disabled={!selected.includes(interest) && selected.length >= MAX_SKILLS}
                        />
                        <Label htmlFor={interest} className="text-sm cursor-pointer">
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4  bottom-0 bg-background pt-4">
          <div className="flex justify-between w-full">
            <div className="text-sm text-muted-foreground">{selected.length} interests selected</div>
            <div className="space-x-2">
              {!isFirstLogin && (
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} variant="accent">{isFirstLogin ? "Save & Continue" : "Save Interests"}</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
