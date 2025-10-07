import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = user.user_metadata?.role === 'admin' || user.email === process.env.ADMIN_EMAIL

  if (!isAdmin) {
    redirect('/')
  }

  // Get all users (admin only)
  const { data, error } = await supabase.auth.admin.listUsers()
  const users = data?.users || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage users and system settings
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            User Management
          </h2>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 pb-3 border-b border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-700 dark:text-gray-300">
              <div>Email</div>
              <div>Created At</div>
              <div>Last Sign In</div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Error loading users: {error.message}
                </p>
              </div>
            )}

            {users && users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 dark:border-gray-700 text-sm"
                >
                  <div className="text-gray-900 dark:text-white">
                    {user.email}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Never'}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No users found
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Admin Information
          </h2>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Current Admin:</span> {user.email}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">User ID:</span> {user.id}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
