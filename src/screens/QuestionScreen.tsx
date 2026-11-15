import {type Feelings} from '../lib/feelings';
import { questionTemplates as prompts } from '../lib/questionTemplates';
import {FeelingsPicker} from '../components/FeelingsPicker';
const topics = ['Tình yêu', 'Sự nghiệp', 'Tài chính', 'Bản thân', 'Tổng quan'];

export function QuestionScreen({ question, topic, context, feelings, onContext, onFeelings, onQuestion, onTopic, onBack, onNext }: {
  context: string; feelings: Feelings; onContext: (text: string) => void; onFeelings: (feelings: Feelings) => void;
  question: string; topic: string; onQuestion: (text: string) => void;
  onTopic: (topic: string) => void; onBack: () => void; onNext: () => void;
}) {
  return <section className="screen-panel">
    <p className="eyebrow">01 · Đặt câu hỏi</p><h1>Bạn đang nghĩ về điều gì?</h1>
    <p className="lede">Bạn muốn nhìn rõ hơn chuyện gì?</p>
    <fieldset className="topic-options"><legend>Chủ đề</legend>
      {topics.map((value) => <button key={value} type="button" aria-pressed={topic === value} onClick={() => {
        onTopic(value);
      }}>{value}</button>)}
    </fieldset>
    <form onSubmit={(event) => { event.preventDefault(); onNext(); }}>
      <label htmlFor="question" className="field-label">Câu hỏi của bạn <span className="muted">(có thể để trống)</span></label>
      <textarea id="question" value={question} onChange={(event) => onQuestion(event.target.value)} maxLength={500}
        rows={4} placeholder={`Ví dụ: ${prompts[topic]}`} aria-describedby="question-help" />
      <button type="button" className="suggestion-button" onClick={() => onQuestion(prompts[topic])}>Dùng câu gợi ý</button>
      <p id="question-help" className="muted quiet-note">Kể chuyện đang xảy ra và điều bạn còn phân vân.</p>
      <label htmlFor="reading-context" className="field-label">Kể thêm <span className="muted">(không bắt buộc)</span></label>
      <textarea id="reading-context" value={context} onChange={(event) => onContext(event.target.value)}
        maxLength={300} rows={3} aria-describedby="context-help" placeholder="Có điều gì khác bạn muốn kể?" />
      <p id="context-help" className="muted quiet-note">{context.length}/300 · Bối cảnh và cảm xúc tự nhập không lưu vào lịch sử.</p>
      <FeelingsPicker value={feelings} onChange={onFeelings} />
      <p className="care-note">Với sức khỏe, tài chính, pháp lý hoặc tự hại, hãy tìm sự hỗ trợ từ chuyên gia phù hợp.</p>
      <div className="actions"><button type="button" onClick={onBack}>Quay lại</button><button className="button-primary" type="submit">Chọn thế bài <span aria-hidden="true">→</span></button></div>
    </form>
  </section>;
}
