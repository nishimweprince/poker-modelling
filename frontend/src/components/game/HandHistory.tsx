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
      <div className="text-center py-8">
        <div className="text-xl">Loading hand history...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-600 text-white p-4 rounded">
        Error loading hand history: {error}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
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
            <div className="text-center py-8 text-green-200">
              No completed hands yet. Play some hands to see history here!
            </div>
          ) : (
            <div className="space-y-4">
              {handHistory.map((hand) => (
                <Card
                  key={hand.id}
                  className="bg-green-600 border-green-500 hover:shadow-2xl"
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold text-yellow-300 font-mono text-sm">{hand.line1}</div>
                      {hand.status && (
                        <span
                          className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${hand.status === 'Completed' ? 'bg-blue-700 text-white' : 'bg-yellow-400 text-black'}`}
                        >
                          {hand.status}
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-sm space-y-1">
                      <div className="text-green-200">{hand.line2}</div>
                      <div className="text-white">{hand.line3}</div>
                      <div className="text-blue-200">{hand.line4}</div>
                      <div className="text-yellow-200 font-bold">{hand.line5}</div>
                      {hand.created_at && (
                        <div className="text-xs text-green-300 mt-2">
                          {new Date(hand.created_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
