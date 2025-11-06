import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { FileText, Save, Clock, CheckCircle } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { TOPSFormData } from "@/types"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"

interface SavedDraft {
  id: string
  data: TOPSFormData
  lastUpdated: string
  step: number
}

interface ApplicationStatus {
  id: string
  token: string
  submittedAt: string
  status: "pending" | "under_review" | "approved" | "rejected"
  lastUpdated: string
}

export function MainDashboard() {
  const navigate = useNavigate()
  const [drafts, setDrafts] = useLocalStorage<SavedDraft[]>("tops-form-drafts", [])
  const [applications, setApplications] = useState<ApplicationStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from('tops_applications')
          .select('id, public_status_token, created_at, status, updated_at')
          .order('created_at', { ascending: false })

        if (error) throw error

        setApplications(data.map(app => ({
          id: app.id,
          token: app.public_status_token,
          submittedAt: new Date(app.created_at).toLocaleDateString(),
          status: app.status || "pending",
          lastUpdated: new Date(app.updated_at).toLocaleDateString()
        })))
      } catch (err) {
        console.error('Error fetching applications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const deleteDraft = (draftId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this draft?")
    if (confirmed) {
      setDrafts(drafts.filter((d: SavedDraft) => d.id !== draftId))
    }
  }

  const continueDraft = (draft: SavedDraft) => {
    // Store the draft data in session storage for the form to pick up
    sessionStorage.setItem("tops-form-data", JSON.stringify(draft.data))
    navigate("/apply")
  }

  const viewApplicationStatus = (token: string) => {
    navigate(`/status?token=${token}`)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          size="lg"
          onClick={() => navigate("/apply")}
          className="bg-amber-600 hover:bg-amber-700"
        >
          Start New Application
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate("/check-status")}
        >
          Check Application Status
        </Button>
      </div>

      {/* Saved Drafts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Saved Drafts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {drafts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No saved drafts found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drafts.map((draft) => (
                  <TableRow key={draft.id}>
                    <TableCell>{draft.lastUpdated}</TableCell>
                    <TableCell>Step {draft.step} of 7</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => continueDraft(draft)}
                        >
                          Continue
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteDraft(draft.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Clock className="w-6 h-6 animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No applications found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.submittedAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {app.status === "pending" && (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        )}
                        {app.status === "under_review" && (
                          <FileText className="w-4 h-4 text-blue-500" />
                        )}
                        {app.status === "approved" && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {app.status === "rejected" && (
                          <CheckCircle className="w-4 h-4 text-red-500" />
                        )}
                        {app.status.replace("_", " ")}
                      </div>
                    </TableCell>
                    <TableCell>{app.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => viewApplicationStatus(app.token)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Links & Resources */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Important Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <strong>Submission Deadline:</strong>
                <br />
                December 31, 2025
              </li>
              <li>
                <strong>Initial Review Period:</strong>
                <br />
                January 1-15, 2026
              </li>
              <li>
                <strong>Final Results:</strong>
                <br />
                February 1, 2026
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Nomination Letter</li>
              <li>Academic Records</li>
              <li>Certificate of Truthfulness</li>
              <li>2x2 ID Photo</li>
              <li>Supporting Documents for Claims</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <strong>Email Support:</strong>
                <br />
                support@topsantique.gov.ph
              </li>
              <li>
                <strong>Phone:</strong>
                <br />
                (123) 456-7890
              </li>
              <li>
                <strong>Office Hours:</strong>
                <br />
                Mon-Fri, 8:00 AM - 5:00 PM
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}