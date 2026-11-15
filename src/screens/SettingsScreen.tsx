import {requestSensorTilt} from '../lib/sensorTilt';
import {InstallSettings,OfflineCardsSettings} from '../components/PwaControls';
import {AmbientSettings} from '../components/AmbientControls';
import type {AmbientController} from '../hooks/useAmbientMusic';
import {feedbackText} from '../lib/feedback';
import {copyText} from '../lib/copyText';
import { ProfileSettings } from '../components/ProfileSettings';
import type { ProfileController } from '../hooks/useProfile';
import { useRef, useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useHistory } from '../hooks/useHistory';
import { ConfirmAction } from '../components/ConfirmAction';
import type { AiInfo } from '../lib/aiClient';
import { LOCAL_HISTORY_NOTICE } from '../lib/historyNotice';
import { useMotionPreference } from '../lib/useMotionPreference';
import type { Settings } from '../lib/settings';

const motions: { value: Settings['motion']; label: string }[] = [
  { value: 'system', label: 'Theo hệ thống' }, { value: 'reduced', label: 'Giảm chuyển động' }, { value: 'full', label: 'Bật chuyển động' },
];
const sizes: { value: Settings['fontScale']; label: string }[] = [
  { value: 'small', label: 'Nhỏ · 92%' }, { value: 'medium', label: 'Vừa · 100%' }, { value: 'large', label: 'Lớn · 112%' },
];
export default function SettingsScreen({music, aiInfo, profileController, onClearProfile}: {music: AmbientController; aiInfo: AiInfo | null; profileController: ProfileController; onClearProfile: () => void}) {
  const { settings, updateSettings, saveStatus } = useSettings();
  const { level, reduced } = useMotionPreference();
  const { readings, clear } = useHistory();
  const [includeQuestion,setIncludeQuestion] = useState(false);
  const [exportMessage,setExportMessage] = useState('');
  const [exportFallback,setExportFallback] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const clearButton = useRef<HTMLButtonElement>(null);
  const close = () => { setConfirm(false); requestAnimationFrame(() => clearButton.current?.focus({ preventScroll: true })); };
  return <section className="screen-panel settings-screen">
    <p className="eyebrow">Theo cách của bạn</p><h1>Cài đặt</h1>
    <InstallSettings/><OfflineCardsSettings/><AmbientSettings music={music}/>
    <ProfileSettings controller={profileController} onClear={onClearProfile} />
    <fieldset className="settings-options"><legend>Hiệu ứng</legend>
      {([['full', 'Đầy đủ'], ['medium', 'Vừa'], ['minimal', 'Tối giản']] as const).map(([value, label]) => <label key={value}><input type="radio" name="effects" checked={settings.effects === value} onChange={() => updateSettings({effects: value})} />{label}</label>)}
      <small role="status">Đang áp dụng: {reduced ? 'Giảm chuyển động' : level === 'full' ? 'Hiệu ứng đầy đủ' : level === 'medium' ? 'Hiệu ứng vừa' : 'Hiệu ứng tối giản'}.</small>
      {reduced && <div>
        <p>{settings.motion === 'reduced' ? 'Bạn đang bật Giảm chuyển động trong ứng dụng.' : 'Thiết bị đang yêu cầu giảm chuyển động; ứng dụng đang theo hệ thống.'} Vì vậy, các hiệu ứng xào, bay và lật được thay bằng chuyển cảnh nhẹ.</p>
        <button type="button" onClick={() => updateSettings({motion: 'full', effects: 'full'})}>Bật đầy đủ hiệu ứng</button>
      </div>}
    </fieldset>
    <label className="switch-row"><input type="checkbox" checked={settings.sensorTilt} onChange={async e=>{if(!e.target.checked){updateSettings({sensorTilt:false});return;}const allowed=await requestSensorTilt();updateSettings({sensorTilt:allowed});setMessage(allowed?'Đã bật nghiêng theo cảm biến khi bạn giữ lá bài.':'Chưa có quyền cảm biến. Bạn vẫn có thể chạm để xem lá.');}}/><span>Nghiêng lá theo cảm biến điện thoại (tùy chọn)</span></label>
    <fieldset className="settings-options"><legend>Chuyển động</legend>
      {motions.map(({ value, label }) => <label key={value}><input type="radio" name="motion" value={value}
        checked={settings.motion === value} onChange={() => updateSettings({ motion: value })} />{label}</label>)}
      <small>“Theo hệ thống” dùng thiết lập của thiết bị. “Giảm chuyển động” luôn tắt các hiệu ứng mạnh; “Bật chuyển động” cho phép hiệu ứng dù thiết bị đang giảm chuyển động.</small>
    </fieldset>
    <fieldset className="settings-options"><legend>Cỡ chữ</legend>
      {sizes.map(({ value, label }) => <label key={value}><input type="radio" name="font-scale" value={value}
        checked={settings.fontScale === value} onChange={() => updateSettings({ fontScale: value })} />{label}</label>)}
      <small>Đang chọn: {sizes.find((item) => item.value === settings.fontScale)?.label}</small>
    </fieldset>
    <label className="switch-row"><input type="checkbox" checked={settings.allowReversedDefault}
      onChange={(event) => updateSettings({ allowReversedDefault: event.target.checked })} />
      <span><strong>Bật bài ngược cho lần sau</strong><small>{settings.allowReversedDefault ? 'Đang bật' : 'Đang tắt'} · Áp dụng cho bài đọc mới.</small></span>
    </label>
    <label className="switch-row"><input type="checkbox" checked={settings.autoSave}
      onChange={(event) => updateSettings({ autoSave: event.target.checked })} />
      <span><strong>Tự lưu bài đọc</strong><small>{settings.autoSave ? 'Đang bật' : 'Đang tắt'} · Lưu khi có bài đọc.</small></span>
    </label>
    <p className="status-note" role="status">{saveStatus === 'saved' ? 'Đã lưu cài đặt.' : saveStatus === 'error'
      ? 'Đã áp dụng, nhưng chưa lưu được cài đặt.' : ''}</p>
    <section className="device-data"><h2>Luận giải theo câu hỏi</h2>
      <label className="switch-row"><input type="checkbox" checked={settings.autoInterpret} onChange={event=>updateSettings({autoInterpret:event.target.checked})}/><span>Tự soạn luận giải sau khi rút bài</span></label>
      <small>Khi bật, câu hỏi được gửi khi bạn mở kết quả của bài vừa rút. Tắt để tự chọn lúc gửi.</small>
      {aiInfo === null && <p>Chưa kết nối được dịch vụ luận giải.</p>}
      <small>Câu hỏi được gửi tới dịch vụ luận giải khi tự soạn hoặc khi bạn bấm nút soạn bài. Ngày sinh và họ tên không rời khỏi máy bạn.</small>
    </section>
    <section className="device-data"><h2>Dữ liệu trên máy này</h2><p>{readings.length} bài đọc đang được lưu. {LOCAL_HISTORY_NOTICE}</p>
      <button ref={clearButton} onClick={() => setConfirm(true)}>Xóa toàn bộ lịch sử</button>
      {confirm && <ConfirmAction message="Xóa hết lịch sử? Bạn không thể khôi phục sau khi xóa."
        onCancel={close} onConfirm={() => {
          const result = clear(); setMessage(result.ok ? 'Đã xóa toàn bộ lịch sử.' : 'Chưa xóa được lịch sử. Bạn hãy thử lại.');
          if (result.ok) close();
        }} />}
      <p className="status-note" role="status">{message}</p>
    </section>
    <section className="device-data"><h2>Phản hồi của tôi</h2>
      <p>Chỉ sao chép id lá, chế độ đọc, id cảm xúc, mong muốn, thời gian và đánh giá. Không gồm bối cảnh, cảm xúc tự nhập hay nội dung luận giải.</p>
      <label className="switch-row"><input type="checkbox" checked={includeQuestion} onChange={e=>{setIncludeQuestion(e.target.checked);setExportFallback('');setExportMessage('');}} /><span>Kèm câu hỏi</span></label>
      <button onClick={async()=>{
        const text=feedbackText(readings,includeQuestion);
        const ok=text ? await copyText(text) : false;
        setExportFallback(ok?'':text);
        setExportMessage(!text?'Bạn chưa lưu phản hồi nào.':ok?'Đã sao chép phản hồi.':'Chưa sao chép được, bạn hãy chọn văn bản và sao chép tay.');
      }}>Sao chép phản hồi</button>
      <p role="status" aria-live="polite">{exportMessage}</p>
      {exportFallback && <label>Chọn văn bản để sao chép<textarea readOnly rows={6} value={exportFallback} onFocus={e=>e.currentTarget.select()} /></label>}
    </section>
    <details className="about-section"><summary>Giới thiệu</summary>
      <p>Huggens: Tarot Nhập Môn; Pollack: Tarot 78 Độ Minh Triết.</p>
      <p>Ảnh bài Rider-Waite-Smith 1909 của Pamela Colman Smith, bản quét từ Wikimedia Commons, phạm vi công cộng.</p>
      <p>Phần luận giải theo câu hỏi được soạn bằng dịch vụ luận giải ({aiInfo?.provider === 'anthropic' ? 'Anthropic Claude' : 'Google Gemini'}) từ nội dung hai cuốn sách.</p>
    </details>
  </section>;
}
