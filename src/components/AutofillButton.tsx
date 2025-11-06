import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { generateTestData } from "@/utils/testData"

interface AutofillButtonProps {
  onFill: (data: any) => void
}

export const AutofillButton = ({ onFill }: AutofillButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleClick = () => {
    setIsLoading(true)
    try {
      const testData = generateTestData()
      onFill(testData)
      toast({
        title: "Form filled with test data",
        description: "You can now review and modify the pre-filled data",
      })
    } catch (error) {
      toast({
        title: "Error filling form",
        description: "Failed to populate form with test data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? "Filling..." : "Fill with Test Data"}
    </Button>
  )
}