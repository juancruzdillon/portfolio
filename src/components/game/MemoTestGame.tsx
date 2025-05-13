"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Puzzle, Target as TargetIcon, Briefcase as BriefcaseIcon } from 'lucide-react';
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
  desktopPairs: { q: string; a: string; qIcon?: React.ElementType; aIcon?: React.ElementType }[];
  mobilePairs: { q: string; a: string; qIcon?: React.ElementType; aIcon?: React.ElementType }[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const MemoTestGame: React.FC<MemoTestGameProps> = ({ desktopPairs, mobilePairs }) => {
  const [cards, setCards] = useState<MemoCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isInteractionDisabled, setIsInteractionDisabled] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

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

  useEffect(() => {
    const checkIsMobile = () => {
      // Use matchMedia for a more robust check against Tailwind's 'md' breakpoint (768px)
      setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    };

    // Initial check
    checkIsMobile();

    // Add event listener
    window.addEventListener('resize', checkIsMobile);

    // Clean up listener
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const initializeGame = useCallback((mobile: boolean) => {
    const gamePairs = mobile ? mobilePairs : desktopPairs;
    const gameCards: MemoCard[] = [];

    gamePairs.forEach((pair, index) => {
      const pairId = `pair-${index}`;
      gameCards.push({ id: `card-${index}-q`, value: pair.q, pairId, isFlipped: false, isMatched: false, Icon: pair.qIcon });
      gameCards.push({ id: `card-${index}-a`, value: pair.a, pairId, isFlipped: false, isMatched: false, Icon: pair.aIcon });
    });
    setCards(shuffleArray(gameCards));
    setFlippedIndices([]);
    setMatchedPairIds([]);
    setMoves(0);
    setIsGameWon(false);
  }, [isMobile, desktopPairs, mobilePairs]); // Add isMobile, desktopPairs, and mobilePairs as dependencies


  useEffect(() => {
    initializeGame(isMobile);
  }, [initializeGame, isMobile]);

  useEffect(() => {
    const currentPairs = isMobile ? mobilePairs : desktopPairs;
    if (matchedPairIds.length === currentPairs.length && currentPairs.length > 0) {
      setIsGameWon(true);
    }
  }, [matchedPairIds, isMobile]); // Depend on isMobile to get correct pairs length

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
        {isGameWon && moves <= 20 && <p className="text-xl font-bold text-primary mt-2">¡Felicidades, ganaste!</p>}
        {isGameWon && moves > 20 && <p className="text-xl font-bold text-primary mt-2">¡Felicidades, ganaste! Pero costo ja...</p>}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5 max-w-md mx-auto">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={cn(
              "aspect-square flex items-center justify-center p-2 cursor-pointer transition-all duration-300 transform-style-preserve-3d rounded-lg shadow-md min-w-[70px] min-h-[70px] sm:min-w-[90px] sm:min-h-[90px]",
              card.isFlipped ? "rotate-y-180 bg-card text-card-foreground" : "bg-primary text-primary-foreground",
              (isInteractionDisabled || isGameWon) && !card.isMatched && !card.isFlipped ? "cursor-not-allowed" : ""
            )}
          >
            {/* Front Face (Puzzle Icon) */}
            <div className={cn(
              "absolute w-full h-full backface-hidden flex items-center justify-center text-center p-2"
            )}>
              <Puzzle className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground/80" />
            </div>

            <div
              className={cn(
                "absolute w-full h-full backface-hidden flex flex-col items-center justify-center text-center rotate-y-180",
                "min-w-0 overflow-hidden"
              )}
            >
              {card.Icon && (
                <card.Icon className="w-8 h-8 sm:w-8 sm:h-8 mx-auto mb-1 text-primary" />
              )}
              <span className="block w-full text-xs sm:text-xs font-medium break-all">
                {card.value}
              </span>
            </div>

          </Card>
        ))}
      </div>
      {(isGameWon || moves > 0) && (
        <Button onClick={() => initializeGame(isMobile)} variant="outline" className="mt-6 bg-card/80 hover:bg-card text-white hover:text-foreground">
          {isGameWon ? 'Jugar de Nuevo' : 'Reiniciar Juego'}
        </Button>
      )}
    </div>
  );
};

export default MemoTestGame;
