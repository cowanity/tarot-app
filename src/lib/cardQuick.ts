/// <reference types="vite/client" />
import type {Card} from '../types';
export type QuickMap=Record<string,{up?:string;rev?:string}>;
const modules=import.meta.glob('../data/cardQuick.json',{eager:true,import:'default'});
const optional=(Object.values(modules)[0]??{}) as QuickMap;
export function quickMeaning(card:Pick<Card,'id'|'summary_up'|'summary_rev'>,reversed=false,overrides:QuickMap=optional){const value=overrides?.[card.id]?.[reversed?'rev':'up'];return typeof value==='string'&&value.trim()?value:reversed?(card.summary_rev||card.summary_up):card.summary_up;}
