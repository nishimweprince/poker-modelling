'use client'

import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addAction, dealHoleCards, dealBoardCards, resetGame } from '@/lib/features/game/gameSlice'
import { PlayerSeat } from './PlayerSeat'
import { ActionPanel } from './ActionPanel'
import { BoardCards } from './BoardCards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function GameTable() {
  const dispatch = useAppDispatch()
  const { currentHand, isLoading, error, gamePhase } = useAppSelector((state) => state.game)
  
  const [selectedPlayer, setSelectedPlayer] = useState<number>(0)
  const [holeCardsInput, setHoleCardsInput] = useState<Record<number, string>>({})
  const [boardCardsInput, setBoardCardsInput] = useState('')

  if (!currentHand) {
    return <div>No active hand</div>
  }

  const handleAction = (actionType: string, amount?: number) => {
    if (currentHand) {
      dispatch(addAction({
        handId: currentHand.id,
        playerPosition: selectedPlayer,
        actionType,
        amount: amount || 0
      }))
    }
  }

  const handleDealHoleCards = () => {
    if (currentHand && Object.keys(holeCardsInput).length > 0) {
      dispatch(dealHoleCards({
        handId: currentHand.id,
        cardsByPosition: holeCardsInput
      }))
    }
  }

  const handleDealBoard = () => {
    if (currentHand && boardCardsInput.trim()) {
      dispatch(dealBoardCards({
        handId: currentHand.id,
        boardCards: boardCardsInput.trim()
      }))
    }
  }

  const handleNewHand = () => {
    dispatch(resetGame())
  }

  return (
    <div className="max-w-6xl mx-auto">
      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <Card className="bg-green-700 border-green-600 text-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-white">
              Hand: {currentHand.id.slice(0, 8)}...
            </CardTitle>
            <div className="flex items-center space-x-4 text-white">
              <span className="text-lg">Pot: ${currentHand.pot_size}</span>
              <span className="text-lg">Round: {currentHand.current_round}</span>
              {gamePhase === 'completed' && (
                <Button
                  onClick={handleNewHand}
                  variant="secondary"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  New Hand
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Board Cards */}
          <BoardCards cards={currentHand.board_cards} />

          {/* Player Seats */}
          <div className="grid grid-cols-3 gap-4">
            {currentHand.players.map((player) => (
              <PlayerSeat
                key={player.position}
                player={player}
                isSelected={selectedPlayer === player.position}
                onSelect={() => setSelectedPlayer(player.position)}
                isCompleted={currentHand.is_completed}
                winnings={currentHand.winnings[player.position]}
              />
            ))}
          </div>

          {/* Action Panel */}
          {!currentHand.is_completed && (
            <ActionPanel
              currentHand={currentHand}
              selectedPlayer={selectedPlayer}
              onAction={handleAction}
              isLoading={isLoading}
            />
          )}

          {/* Card Dealing Controls */}
          <div className="space-y-4">
            <Card className="bg-green-600 border-green-500">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Deal Hole Cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {currentHand.players.map((player) => (
                    <div key={player.position} className="flex items-center space-x-2">
                      <label className="text-sm text-white">P{player.position + 1}:</label>
                      <Input
                        type="text"
                        value={holeCardsInput[player.position] || ''}
                        onChange={(e) => setHoleCardsInput({
                          ...holeCardsInput,
                          [player.position]: e.target.value
                        })}
                        placeholder="AhKs"
                        className="bg-green-500 border-green-400 text-white text-sm placeholder:text-green-300"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleDealHoleCards}
                  disabled={isLoading}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Deal Hole Cards
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-green-600 border-green-500">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Deal Board Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Input
                    type="text"
                    value={boardCardsInput}
                    onChange={(e) => setBoardCardsInput(e.target.value)}
                    placeholder="AhKsQd (flop) or AhKsQdJc (turn) or AhKsQdJc2s (river)"
                    className="flex-1 bg-green-500 border-green-400 text-white placeholder:text-green-300"
                  />
                  <Button
                    onClick={handleDealBoard}
                    disabled={isLoading}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Deal Board
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hand Completion Status */}
          {currentHand.is_completed && (
            <Card className="bg-blue-600 border-blue-500">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-2 text-white">Hand Completed!</h3>
                <p className="text-white">Winners: {currentHand.winner_positions.map(p => `Player ${p + 1}`).join(', ')}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
