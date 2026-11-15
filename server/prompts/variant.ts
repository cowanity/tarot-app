export type PromptVariant='old'|'v1';
export function promptVariant(value=process.env.PROMPT_VARIANT):PromptVariant{if(value===undefined||value==='v1')return 'v1';if(value==='old')return 'old';throw new Error('INVALID_PROMPT_VARIANT');}
