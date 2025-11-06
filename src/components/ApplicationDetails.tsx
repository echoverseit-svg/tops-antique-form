import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Application, ApplicationComment, ApplicationStatus, APPLICATION_STATUS_LABELS } from '../types/admin'
import { MessageCircle, Send, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react'

interface Props {
  application: Application
  onStatusChange: (newStatus: ApplicationStatus) => void
}

export default function ApplicationDetails({ application, onStatusChange }: Props) {
  const [comments, setComments] = useState<ApplicationComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isInternalComment, setIsInternalComment] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    fetchComments()
  }, [application.id])

  const fetchComments = async () => {
    try {
      const { data: comments, error } = await supabase
        .from('application_comments')
        .select(`
          *,
          user:created_by (
            email
          )
        `)
        .eq('application_id', application.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(comments || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const addComment = async () => {
    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('application_comments')
        .insert({
          application_id: application.id,
          comment_text: newComment.trim(),
          is_internal: isInternalComment
        })

      if (error) throw error

      setNewComment('')
      await fetchComments()
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (status: ApplicationStatus) => {
    try {
      const { error } = await supabase
        .from('tops_applications')
        .update({ status })
        .eq('id', application.id)

      if (error) throw error
      onStatusChange(status)

      // Automatically add a comment about the status change
      await supabase
        .from('application_comments')
        .insert({
          application_id: application.id,
          comment_text: `Application status changed to ${APPLICATION_STATUS_LABELS[status]}`,
          is_internal: true
        })

      await fetchComments()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-500" />
      case 'under_review':
        return <Loader2 className="w-5 h-5 text-blue-500" />
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusBadgeColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'under_review':
        return 'bg-blue-100 text-blue-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Status Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
        <div className="flex gap-2">
          {(['pending', 'under_review', 'approved', 'rejected'] as ApplicationStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => updateStatus(status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                application.status === status
                  ? getStatusBadgeColor(status)
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {getStatusIcon(status)}
              {APPLICATION_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments
        </h3>
        
        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg ${
                comment.is_internal ? 'bg-yellow-50 border border-yellow-100' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-600">
                  {comment.is_internal && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded mr-2">
                      Internal Note
                    </span>
                  )}
                  <span className="font-medium">{comment.user?.email}</span>
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{comment.comment_text}</p>
            </div>
          ))}
          
          {comments.length === 0 && (
            <p className="text-center text-gray-500 py-4">No comments yet</p>
          )}
        </div>

        {/* Add Comment */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isInternalComment}
                onChange={(e) => setIsInternalComment(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              Internal note (only visible to admins)
            </label>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  addComment()
                }
              }}
            />
            <button
              onClick={addComment}
              disabled={isLoading || !newComment.trim()}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}