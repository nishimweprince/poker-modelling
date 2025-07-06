'use client'

import React, { useState } from 'react'
import { Hand } from '@/lib/features/game/gameSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ActionPanelProps {
  currentHand: Hand
  selectedPlayer: number
  onAction: (actionType: string, amount?: number) => void
  isLoading: boolean
}

export function ActionPanel({ currentHand, selectedPlayer, onAction, isLoading }: ActionPanelProps) {
  const [betAmount, setBetAmount] = useState('')
  const [raiseAmount, setRaiseAmount] = useState('')

  const selectedPlayerData = currentHand.players.find(p => p.position === selectedPlayer)
  
  if (!selectedPlayerData || selectedPlayerData.is_folded) {
    return (
      <Card className="bg-green-600 border-green-500 text-white">
        <CardContent className="pt-6">
          <p className="text-center text-white">
            {selectedPlayerData?.is_folded 
              ? 'Selected player has folded' 
              : 'Select a player to take action'
            }
          </p>
        </CardContent>
      </Card>
    )
  }

  const maxBet = Math.max(...currentHand.players.filter(p => !p.is_folded).map(p => p.current_bet))
  const callAmount = maxBet - selectedPlayerData.current_bet
  const canCheck = selectedPlayerData.current_bet === maxBet
  const canCall = selectedPlayerData.current_bet < maxBet
  const minRaise = maxBet + 40 // Minimum raise is one big blind

  const handleBet = () => {
    const amount = parseInt(betAmount)
    if (amount >= 40) {
      onAction('bet', amount)
      setBetAmount('')
    }
  }

  const handleRaise = () => {
    const amount = parseInt(raiseAmount)
    if (amount >= minRaise) {
      onAction('raise', amount)
      setRaiseAmount('')
    }
  }

  return (
    <Card className="bg-green-600 border-green-500 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">
          Actions for {selectedPlayerData.name} (Position {selectedPlayer + 1})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => onAction('fold')}
            disabled={isLoading}
            variant="destructive"
            className="font-bold"
          >
            Fold
          </Button>

          {canCheck && (
            <Button
              onClick={() => onAction('check')}
              disabled={isLoading}
              variant="secondary"
              className="font-bold"
            >
              Check
            </Button>
          )}

          {canCall && (
            <Button
              onClick={() => onAction('call')}
              disabled={isLoading}
              variant="default"
              className="bg-yellow-600 hover:bg-yellow-700 font-bold"
            >
              Call ${callAmount}
            </Button>
          )}

          <Button
            onClick={() => onAction('allin')}
            disabled={isLoading || selectedPlayerData.stack === 0}
            variant="outline"
            className="bg-purple-600 hover:bg-purple-700 border-purple-500 text-white font-bold"
          >
            All-In (${selectedPlayerData.stack})
          </Button>
        </div>

        <div className="space-y-3">
          {maxBet === 0 && (
            <div className="flex items-center space-x-3">
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Bet amount (min 40)"
                min="40"
                max={selectedPlayerData.stack}
                className="flex-1 bg-green-500 border-green-400 text-white placeholder:text-green-300"
              />
              <Button
                onClick={handleBet}
                disabled={isLoading || !betAmount || parseInt(betAmount) < 40}
                className="bg-orange-600 hover:bg-orange-700 font-bold"
              >
                Bet
              </Button>
            </div>
          )}

          {maxBet > 0 && (
            <div className="flex items-center space-x-3">
              <Input
                type="number"
                value={raiseAmount}
                onChange={(e) => setRaiseAmount(e.target.value)}
                placeholder={`Raise to (min ${minRaise})`}
                min={minRaise}
                max={selectedPlayerData.stack + selectedPlayerData.current_bet}
                className="flex-1 bg-green-500 border-green-400 text-white placeholder:text-green-300"
              />
              <Button
                onClick={handleRaise}
                disabled={isLoading || !raiseAmount || parseInt(raiseAmount) < minRaise}
                className="bg-orange-600 hover:bg-orange-700 font-bold"
              >
                Raise
              </Button>
            </div>
          )}
        </div>

        <div className="text-sm text-green-200">
          <p>Stack: ${selectedPlayerData.stack} | Current Bet: ${selectedPlayerData.current_bet}</p>
          {canCall && <p>To Call: ${callAmount}</p>}
          {maxBet > 0 && <p>Min Raise To: ${minRaise}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
