import {useState} from 'react';
import {FEELINGS, WANT_LABELS, DURATION_LABELS, sanitizeFeelings, type Feelings} from '../lib/feelings';
export function FeelingsPicker({value,onChange}:{value:Feelings;onChange:(value:Feelings)=>void}) {
  const [otherDraft,setOtherDraft] = useState(value.other??'');
  const patch = (next:Partial<Feelings>) => onChange(sanitizeFeelings({...value,...next}));
  const toggle = (id:string) => {
    const ids = value.ids.includes(id) ? value.ids.filter(v=>v!==id) : value.ids.length<3 ? [...value.ids,id] : value.ids;
    if(!ids.includes('kho_goi_ten'))setOtherDraft('');
    patch({ids,...(!ids.includes('kho_goi_ten') ? {other:undefined} : {})});
  };
  return <section className="feelings-picker" aria-label="Cảm xúc và mong muốn">
    <h2>Cảm xúc lúc này <small aria-live="polite">{value.ids.length}/3 · Có thể bỏ qua</small></h2>
    {(['Nặng nề','Giằng co','Sáng','Đặc biệt'] as const).map(group=><fieldset key={group} className="feeling-group"><legend>{group}</legend>
      <div className="feeling-chips">{FEELINGS.filter(f=>f.group===group).map(f=><button type="button" key={f.id} aria-pressed={value.ids.includes(f.id)}
        disabled={value.ids.length>=3&&!value.ids.includes(f.id)} onClick={()=>toggle(f.id)}>{f.label}</button>)}</div>
    </fieldset>)}
    {value.ids.includes('kho_goi_ten')&&<label className="field-label" htmlFor="other-feeling">Cảm xúc khác
      <input id="other-feeling" value={otherDraft} maxLength={40} onChange={e=>{const text=e.target.value.replace(/[<>\p{Cc}\p{Cf}]/gu,'');setOtherDraft(text);patch({other:text});}} placeholder="Viết theo cách của bạn" />
      <small>{otherDraft.length}/40 · Không lưu nội dung này vào lịch sử.</small>
    </label>}
    <details className="feeling-more"><summary>Kể thêm (có thể bỏ qua)</summary>
      <fieldset className="feeling-group"><legend>Cảm xúc mạnh đến đâu?</legend><div className="feeling-chips intensity-steps">
        {([1,2,3,4,5] as const).map((n)=><button type="button" key={n} aria-pressed={value.intensity===n}
          onClick={()=>patch({intensity:value.intensity===n?undefined:n})}>{n}<small>{['Nhẹ','Hơi nặng','Vừa','Nặng','Rất nặng'][n-1]}</small></button>)}
      </div></fieldset>
      <fieldset className="feeling-group"><legend>Bạn mong điều gì từ buổi đọc?</legend><div className="feeling-choices">
        {(Object.keys(WANT_LABELS) as (keyof typeof WANT_LABELS)[]).map(id=><button type="button" key={id} aria-pressed={value.want===id}
          onClick={()=>patch({want:value.want===id?undefined:id})}>{WANT_LABELS[id]}</button>)}
      </div></fieldset>
      <fieldset className="feeling-group"><legend>Chuyện này kéo dài bao lâu?</legend><div className="feeling-choices">
        {(Object.keys(DURATION_LABELS) as (keyof typeof DURATION_LABELS)[]).map(id=><button type="button" key={id} aria-pressed={value.duration===id}
          onClick={()=>patch({duration:value.duration===id?undefined:id})}>{DURATION_LABELS[id]}</button>)}
      </div></fieldset>
      <small>Bấm lại lựa chọn đang bật để bỏ chọn.</small>
    </details>
  </section>;
}
