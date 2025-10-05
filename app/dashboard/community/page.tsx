import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PostCard } from "@/components/post-card"
import { CreatePostDialog } from "@/components/create-post-dialog"

export default async function CommunityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch all posts with user profiles
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:user_id (
        username,
        full_name,
        avatar_url
      ),
      plants (
        name,
        species
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Community</h1>
            <p className="mt-2 text-green-700">Share your plant journey and connect with fellow enthusiasts</p>
          </div>
          <CreatePostDialog userId={user!.id}>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </CreatePostDialog>
        </div>

        <div className="space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} currentUserId={user!.id} />)
          ) : (
            <div className="rounded-lg border border-green-200 bg-white p-12 text-center">
              <p className="text-green-700">No posts yet. Be the first to share!</p>
              <CreatePostDialog userId={user!.id}>
                <Button className="mt-4 bg-green-600 hover:bg-green-700">Create First Post</Button>
              </CreatePostDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
