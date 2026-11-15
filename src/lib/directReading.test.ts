import {expect, test, vi} from 'vitest';
import {isValidElement, type ReactNode} from 'react';
import {AiReadingPanel} from '../components/AiReadingPanel';
import type {AiReadingController} from '../hooks/useAiReading';
import type {AiPayload} from './aiClient';
import {initialAiState} from './aiState';
function buttons(node: ReactNode): {onClick?:()=>void; disabled?:boolean}[] {
  if (Array.isArray(node)) return node.flatMap(buttons);
  if (!isValidElement<{children?:ReactNode;onClick?:()=>void;disabled?:boolean}>(node)) return [];
  return [...(node.type==='button'?[node.props]:[]),...buttons(node.props.children)];
}
test('the reading button calls the service directly without consent gating',()=>{
  const payload:AiPayload={question:'',context:'',feelings:{ids:[]},topic:'Tổng quan',spreadId:'one',picks:[]};
  const run=vi.fn(async()=>{});
  const ai:AiReadingController={state:initialAiState,run,autoRun:vi.fn(),abortPending:vi.fn(),cancel:vi.fn(),remaining:0};
  const tree=AiReadingPanel({info:{provider:'gemini',freeTier:true},ai,payload});
  buttons(tree)[0].onClick?.();
  expect(run).toHaveBeenCalledExactlyOnceWith(payload);
  const loading=AiReadingPanel({info:{provider:'gemini',freeTier:true},ai:{...ai,state:{...initialAiState,status:'loading'}},payload});
  expect(buttons(loading)).toHaveLength(0); // Only the ritual owns its Cancel button.
  expect(run).toHaveBeenCalledTimes(1);
});
