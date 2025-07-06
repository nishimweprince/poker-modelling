'use client'

import { GameSetup } from '@/components/game/GameSetup'
import { GameTable } from '@/components/game/GameTable'
import { HandHistory } from '@/components/game/HandHistory'
import { useAppSelector } from '@/lib/hooks'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function Home() {
  const { gamePhase } = useAppSelector((state) => state.game)

  return (
    <div className="min-h-screen bg-green-800 text-white">
      <header className="bg-green-900 p-4 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Texas Hold&apos;em Poker</h1>
      </header>

      <main className="container mx-auto p-4">
        <Tabs defaultValue="game" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-green-700 border-green-600">
              <TabsTrigger 
                value="game" 
                className="data-[state=active]:bg-green-600 cursor-pointer hover:bg-green-800 data-[state=active]:text-white text-green-200"
              >
                Game
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-green-600 cursor-pointer hover:bg-green-800 data-[state=active]:text-white text-green-200"
              >
                Hand History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="game">
            {gamePhase === 'setup' && <GameSetup />}
            {(gamePhase === 'playing' || gamePhase === 'completed') && <GameTable />}
          </TabsContent>

          <TabsContent value="history">
            <HandHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
