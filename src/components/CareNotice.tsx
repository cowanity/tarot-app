import {labelsOf, type Feelings} from '../lib/feelings';
import {supportInfo} from '../lib/supportInfo';
export function CareNotice({feelings, crisis = true}: {feelings?: Feelings; crisis?: boolean} = {}) {
  const labels = feelings ? labelsOf(feelings.ids).filter(label => label !== 'Khó gọi tên') : [];
  return <aside className="care-note crisis-note" aria-label="Lời nhắn quan tâm">
    <h2>Bạn không cần đi qua điều này một mình.</h2>
    {labels.length > 0 && <p>Bạn đã chia sẻ cảm xúc {labels.join(', ').toLocaleLowerCase('vi')}. Cảm xúc này xứng đáng được lắng nghe.</p>}
    {!crisis && <p>Bạn có thể nói chuyện với một người tin cậy hoặc chuyên gia để được lắng nghe và hỗ trợ, theo nhịp phù hợp với bạn.</p>}
    {crisis && <p>Nếu bạn đang nghĩ đến việc làm đau bản thân, hãy liên hệ một người bạn tin cậy hoặc chuyên gia để được ở bên và hỗ trợ. Nếu bạn đang gặp nguy hiểm ngay lúc này, hãy gọi số cấp cứu tại địa phương hoặc đến cơ sở cấp cứu gần nhất.</p>}
    <p>Bạn vẫn có thể xem bài đọc dưới đây, nhưng đừng để những lá bài thay thế sự giúp đỡ trực tiếp.</p>
    {supportInfo.length > 0 && <ul>{supportInfo.map(item => <li key={item.label}>{item.label}{item.phone && ` · ${item.phone}`}{item.url && <a href={item.url}>Thông tin hỗ trợ</a>}</li>)}</ul>}
  </aside>;
}
