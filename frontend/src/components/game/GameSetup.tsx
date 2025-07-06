'use client'

import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { createNewHand } from '@/lib/features/game/gameSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function GameSetup() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.game)
  
  const [stacks, setStacks] = useState([1000, 1000, 1000, 1000, 1000, 1000])

  const handleStackChange = (index: number, value: string) => {
    const newStacks = [...stacks]
    newStacks[index] = parseInt(value) || 0
    setStacks(newStacks)
  }

  const handleStartGame = () => {
    dispatch(createNewHand(stacks))
  }

  return (
    <section className="max-w-2xl mx-auto">
      <Card className="bg-green-700 border-green-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Game Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="grid grid-cols-2 gap-4" onSubmit={e => e.preventDefault()}>
            {stacks.map((stack, index) => (
              <fieldset key={index} className="flex items-center space-x-3">
                <label className="text-lg font-medium w-24 text-white">
                  Player {index + 1}:
                </label>
                <Input
                  type="number"
                  value={stack}
                  onChange={(e) => handleStackChange(index, e.target.value)}
                  className="flex-1 bg-green-600 border-green-500 text-white placeholder:text-green-300"
                  placeholder="Stack size"
                  min="0"
                />
              </fieldset>
            ))}
          </form>

          <section className="text-center space-y-4">
            <article className="text-sm text-green-200">
              <p>Game Settings:</p>
              <p>Small Blind: 20 | Big Blind: 40 | No Ante</p>
              <p>6-Max Texas Hold&apos;em</p>
            </article>

            {error && (
              <aside className="bg-red-600 text-white p-3 rounded">
                Error: {error}
              </aside>
            )}

            <Button
              onClick={handleStartGame}
              disabled={isLoading || stacks.some(s => s <= 0)}
              className="bg-yellow-600 cursor-pointer hover:bg-yellow-700 disabled:bg-gray-600 text-white font-bold py-3 px-8 text-lg"
              size="lg"
            >
              {isLoading ? 'Starting Game...' : 'Start New Hand'}
            </Button>
          </section>
        </CardContent>
      </Card>
    </section>
  )
}
