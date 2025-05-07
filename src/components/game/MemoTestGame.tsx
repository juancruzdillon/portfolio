"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Zap, Brain, Puzzle, Lightbulb, Award, Code, UserCircle, MapPin, Sparkles, Target as TargetIcon, Briefcase as BriefcaseIcon } from 'lucide-react';
import NextjsIcon from '@/icons/NextjsIcon';
import ReactIcon from '@/icons/ReactIcon';
import Confetti from 'react-confetti';

interface MemoCard {
  id: string;
  value: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
  Icon?: React.ElementType;
}

interface MemoTestGameProps {
  pairs: { q: string; a: string; qIcon?: React.ElementType; aIcon?: React.ElementType }[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const MemoTestGame: React.FC<MemoTestGameProps> = ({ pairs }) => {
  const [cards, setCards] = useState<MemoCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isInteractionDisabled, setIsInteractionDisabled] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    const styleId = 'memo-test-game-styles';
    if (!document.getElementById(styleId) && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const initializeGame = useCallback(() => {
    const gameCards: MemoCard[] = [];
    pairs.forEach((pair, index) => {
      const pairId = `pair-${index}`;
      gameCards.push({ id: `card-${index}-q`, value: pair.q, pairId, isFlipped: false, isMatched: false, Icon: pair.qIcon });
      gameCards.push({ id: `card-${index}-a`, value: pair.a, pairId, isFlipped: false, isMatched: false, Icon: pair.aIcon });
    });
    setCards(shuffleArray(gameCards));
    setFlippedIndices([]);
    setMatchedPairIds([]);
    setMoves(0);
    setIsGameWon(false);
  }, [pairs]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (matchedPairIds.length === pairs.length && pairs.length > 0) {
      setIsGameWon(true);
    }
  }, [matchedPairIds, pairs.length]);

  const handleCardClick = (index: number) => {
    if (isInteractionDisabled || cards[index].isFlipped || cards[index].isMatched || isGameWon) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    const newCards = cards.map((card, i) => 
      i === index ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      setIsInteractionDisabled(true);
      const firstCard = newCards[newFlippedIndices[0]];
      const secondCard = newCards[newFlippedIndices[1]];

      if (firstCard.pairId === secondCard.pairId) {
        setMatchedPairIds([...matchedPairIds, firstCard.pairId]);
        setCards(prevCards => prevCards.map(card =>
          card.pairId === firstCard.pairId ? { ...card, isMatched: true } : card
        ));
        setFlippedIndices([]);
        setIsInteractionDisabled(false);
      } else {
        setTimeout(() => {
          setCards(prevCards => prevCards.map((card, i) =>
            (newFlippedIndices.includes(i) && !card.isMatched) ? { ...card, isFlipped: false } : card
          ));
          setFlippedIndices([]);
          setIsInteractionDisabled(false);
        }, 1000);
      }
    }
  };

  if (cards.length === 0) {
    return <p className="text-center text-white/80">Cargando juego...</p>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      {isGameWon && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 300}
          recycle={false}
          numberOfPieces={300}
          tweenDuration={8000}
        />
      )}
      <div className="mb-4 text-center">
        <p className="text-lg text-white/90">Movimientos: {moves}</p>
        {isGameWon && <p className="text-xl font-bold text-primary mt-2">¡Felicidades, ganaste!</p>}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5 max-w-md mx-auto">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={cn(
              "aspect-square flex items-center justify-center p-2 cursor-pointer transition-all duration-300 transform-style-preserve-3d rounded-lg shadow-md min-w-[80px] min-h-[80px] sm:min-w-[90px] sm:min-h-[90px]",
              card.isFlipped ? "bg-card text-card-foreground rotate-y-180" : "bg-primary text-primary-foreground",
              card.isMatched ? "opacity-100 cursor-not-allowed border-2 border-green-500" : "",
              (isInteractionDisabled || isGameWon) && !card.isMatched && !card.isFlipped ? "cursor-not-allowed" : ""
            )}
          >
            <div className={cn("text-center backface-hidden w-full h-full flex flex-col items-center justify-center", card.isFlipped ? "rotate-y-180" : "")}>
              {card.isFlipped ? (
                <>
                  {card.Icon && <card.Icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 text-primary" />}
                  <span className="text-xs sm:text-sm font-medium break-words">{card.value}</span>
                </>
              ) : (
                <Puzzle className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground/80" />
              )}
            </div>
          </Card>
        ))}
      </div>
      {(isGameWon || moves > 0) && (
         <Button onClick={initializeGame} variant="outline" className="mt-6 bg-card/80 hover:bg-card text-white hover:text-foreground">
            {isGameWon ? 'Jugar de Nuevo' : 'Reiniciar Juego'}
        </Button>
      )}
    </div>
  );
};

export default MemoTestGame;
