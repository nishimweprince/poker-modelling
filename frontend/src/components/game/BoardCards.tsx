'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BoardCardsProps {
  cards: string
}

export function BoardCards({ cards }: BoardCardsProps) {
  const formatCards = (cardString: string) => {
    if (!cardString) return []
    
    const cardPairs: string[] = []
    for (let i = 0; i < cardString.length; i += 2) {
      if (i + 1 < cardString.length) {
        cardPairs.push(cardString.slice(i, i + 2))
      }
    }
    return cardPairs
  }

  const cardArray = formatCards(cards)
  const roundNames = ['', 'flop', 'flop', 'flop', 'turn', 'river']

  return (
    <Card className="text-center mb-6 bg-green-700 border-green-600 text-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Board Cards</CardTitle>
      </CardHeader>
      <CardContent>
        <section className="flex justify-center space-x-2 mb-3">
          {cardArray.length === 0 ? (
            <article className="bg-gray-600 w-16 h-24 rounded border-2 border-dashed border-gray-400 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No cards</span>
            </article>
          ) : (
            cardArray.map((card, index) => (
              <article
                key={index}
                className="bg-white text-black w-16 h-24 rounded border-2 border-gray-300 flex items-center justify-center font-bold text-lg shadow-lg"
              >
                {card}
              </article>
            ))
          )}
        </section>
        {cardArray.length > 0 && (
          <aside className="text-green-200 capitalize">
            {roundNames[cardArray.length] || 'board'}
          </aside>
        )}
      </CardContent>
    </Card>
  )
}
