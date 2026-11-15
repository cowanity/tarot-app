import { CardBack } from '../components/CardBack';
export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return <><section className="welcome screen-panel">
    <div className="welcome-card" aria-hidden="true"><CardBack /></div>
    <p className="eyebrow">Một khoảng lặng dành cho bạn</p>
    <h1>Để những lá bài<br />mở một góc nhìn mới.</h1>
    <p className="lede">Giữ trong lòng một câu hỏi. Chậm lại, lắng nghe và tìm điều đáng suy ngẫm trong câu chuyện của mình.</p>
    <button className="button-primary" onClick={onStart}>Bắt đầu trải bài <span aria-hidden="true">↗</span></button>
  </section></>;
}
