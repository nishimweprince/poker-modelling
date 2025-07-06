'use client'

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchHandHistory } from '@/lib/features/game/gameSlice'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function HandHistory() {
  const dispatch = useAppDispatch()
  const { handHistory, isLoading, error } = useAppSelector((state) => state.game)

  useEffect(() => {
    dispatch(fetchHandHistory(100))
  }, [dispatch])

  if (isLoading) {
    return (
      <section className="text-center py-8">
        <div className="text-xl">Loading hand history...</div>
      </section>
    )
  }

  if (error) {
    return (
      <aside className="bg-red-600 text-white p-4 rounded">
        Error loading hand history: {error}
      </aside>
    )
  }

  return (
    <section className="max-w-6xl mx-auto">
      <Card className="bg-green-700 border-green-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Hand History</CardTitle>
          <CardAction>
            <Button
              onClick={() => dispatch(fetchHandHistory(50))}
              variant="secondary"
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
            >
              Refresh
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          {handHistory.length === 0 ? (
            <section className="text-center py-8 text-green-200">
              No completed hands yet. Play some hands to see history here!
            </section>
          ) : (
            <section className="space-y-4">
              {handHistory.map((hand) => (
                <article
                  key={hand.id}
                  className="bg-green-600 border-green-500 hover:shadow-2xl"
                >
                  <CardContent className="pt-6">
                    <header className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-yellow-300 font-mono text-sm">{hand.line1}</h3>
                      {hand.status && (
                        <span
                          className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${hand.status === 'Completed' ? 'bg-blue-700 text-white' : 'bg-yellow-400 text-black'}`}
                        >
                          {hand.status}
                        </span>
                      )}
                    </header>
                    <section className="font-mono text-sm space-y-1">
                      <p className="text-green-200">{hand.line2}</p>
                      <p className="text-white">{hand.line3}</p>
                      <p className="text-blue-200">{hand.line4}</p>
                      <p className="text-yellow-200 font-bold">{hand.line5}</p>
                      {hand.created_at && (
                        <time className="text-xs text-green-300 mt-2 block">
                          {new Date(hand.created_at).toLocaleString()}
                        </time>
                      )}
                    </section>
                  </CardContent>
                </article>
              ))}
            </section>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
