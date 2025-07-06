'use client'

import React from 'react'
import { Player } from '@/lib/features/game/gameSlice'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PlayerSeatProps {
  player: Player
  isSelected: boolean
  onSelect: () => void
  isCompleted: boolean
  winnings?: number
}

export function PlayerSeat({ player, isSelected, onSelect, isCompleted, winnings }: PlayerSeatProps) {
  const getBadges = () => {
    const badges: string[] = []
    if (player.is_dealer) badges.push('D')
    if (player.is_small_blind) badges.push('SB')
    if (player.is_big_blind) badges.push('BB')
    return badges
  }

  const getStatusColor = () => {
    if (player.is_folded) return 'bg-gray-600'
    if (isSelected) return 'bg-blue-600'
    return 'bg-green-600'
  }

  return (
    <article
      onClick={onSelect}
      className={cn(
        "cursor-pointer border-2 p-4 rounded-lg transition-all hover:border-yellow-300 text-white",
        getStatusColor(),
        isSelected ? 'border-yellow-400' : 'border-transparent'
      )}
    >
      <CardHeader className="pb-3">
        <header className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-white">{player?.name}</h3>
          <nav className="flex space-x-1">
            {getBadges().map((badge) => (
              <Badge
                key={badge}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold"
              >
                {badge}
              </Badge>
            ))}
          </nav>
        </header>
      </CardHeader>

      <CardContent className="space-y-1 text-sm">
        <section className="flex justify-between text-white">
          <span>Stack:</span>
          <span className="font-mono">${player.stack}</span>
        </section>
        
        <section className="flex justify-between text-white">
          <span>Current Bet:</span>
          <span className="font-mono">${player.current_bet}</span>
        </section>
        
        <section className="flex justify-between text-white">
          <span>Total Invested:</span>
          <span className="font-mono">${player.total_invested}</span>
        </section>

        {player.hole_cards && (
          <section className="flex justify-between text-white">
            <span>Cards:</span>
            <span className="font-mono bg-white text-black px-2 py-1 rounded">
              {player.hole_cards}
            </span>
          </section>
        )}

        {player.is_folded && (
          <aside className="text-center text-red-300 font-bold">FOLDED</aside>
        )}

        {isCompleted && winnings !== undefined && (
          <section className="flex justify-between font-bold text-white">
            <span>Result:</span>
            <span className={`font-mono ${winnings >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {winnings >= 0 ? '+' : ''}${winnings}
            </span>
          </section>
        )}
      </CardContent>
    </article>
  )
}
