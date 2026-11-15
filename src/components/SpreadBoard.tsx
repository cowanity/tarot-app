import type {CSSProperties} from 'react';
import {useRef} from 'react';
import type {DrawnCard,Spread,SpreadPosition} from '../types';
import type {CardRect} from '../fx/CardFlight';
import {OccupiedSlot} from './BoardCard';
import {MobileCelticBoard} from './MobileCelticBoard';
import {useNarrowBoard,useBoardWidth} from '../hooks/useBoardWidth';
import {threeCardWidth} from '../lib/mobileCelticLayout';
export interface SpreadBoardProps {
  origins: Map<number,CardRect>; spread: Spread; reading: DrawnCard[]; pickedIndices: number[]; revealed: number[]; revealing: boolean;
  onFlip: (index: number) => void; onFinish: (index: number) => void;
}
export function SpreadBoard(props:SpreadBoardProps){const narrow=useNarrowBoard();return narrow&&props.spread.id==='celtic-cross'?<MobileCelticBoard {...props}/>:<LegacyBoard {...props}/>;}
function LegacyBoard({origins,spread,reading,pickedIndices,revealed,revealing,onFlip,onFinish}:SpreadBoardProps){
  const host=useRef<HTMLDivElement>(null),width=useBoardWidth(host),narrow=useNarrowBoard();
  const rowStyle=narrow&&spread.card_count===3&&width?{'--card-w':`${threeCardWidth(width)}px`,'--card-gap':'12px','--board-pad':'0px'} as CSSProperties:undefined;
  const minX = Math.min(...spread.positions.map((p) => p.x)), minY = Math.min(...spread.positions.map((p) => p.y));
  const maxX = Math.max(...spread.positions.map((p) => p.x)) - minX, maxY = Math.max(...spread.positions.map((p) => p.y)) - minY;
  const coords = (p: SpreadPosition) => ({
    left: `calc(var(--board-pad) + ${p.x - minX} * var(--board-col))`,
    top: `calc(var(--board-pad) + ${p.y - minY} * var(--board-row))`,
  });
  return <div ref={host} className={`board-scroll legacy-board ${spread.card_count===3?'legacy-three':''}`} style={rowStyle} tabIndex={0} role="region" aria-label="Bố cục thế bài, có thể cuộn ngang">
    <div className="spread-board" style={{
      width: `calc(${maxX} * var(--board-col) + var(--card-w) + 2 * var(--board-pad))`,
      height: `calc(${maxY + 1} * var(--board-row) + 2 * var(--board-pad))`,
    }}>
      {spread.positions.map((position, index) => <div key={position.number} className={`board-slot ${position.rotation ? 'cross-slot' : ''}`}
        style={{ ...coords(position), zIndex: position.rotation ? 2 : 1 }}>
        {!reading[index] && <div className="empty-slot" style={{ transform: `rotate(${position.rotation ?? 0}deg)` }} aria-hidden="true"><span>{position.number}</span></div>}
        {reading[index] && <OccupiedSlot origin={origins.get(pickedIndices[index])} item={reading[index]} index={index} deckIndex={pickedIndices[index]}
          flipped={revealed.includes(index)} revealing={revealing} onFlip={onFlip} onFinish={onFinish} />}
        <p className="position-label">{position.number}. {position.name_vi}</p>
      </div>)}
    </div>
  </div>;
}
