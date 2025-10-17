import { AccountSelector } from '@/components/AccountSelector'
import { GoalCard } from '@/components/home/GoalCard'
import { FollowerGrowthChart } from '@/components/home/FollowerGrowthChart'
import { NextHookCard } from '@/components/home/NextHookCard'
import { PostCoachSection } from '@/components/home/PostCoachSection'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Home</h1>
          <AccountSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">Good Morning, Nikhil</h2>
        </div>

        {/* Goal Section */}
        <GoalCard />

        {/* Growth Chart */}
        <FollowerGrowthChart />

        {/* Next Hook */}
        <NextHookCard />

        {/* Post Coach */}
        <PostCoachSection />
      </main>
    </div>
  )
}
