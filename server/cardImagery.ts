import data from './data/cardImagery.json';
export const cardImagery:Readonly<Record<string,string>>=data;
export function imageryFor(id:string):string {return cardImagery[id]??'';}
