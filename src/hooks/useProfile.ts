import { useState } from 'react';
import { browserStorage } from '../lib/browserStorage';
import { calculateProfile, EMPTY_PROFILE, readProfile, writeProfile, type ProfileDraft } from '../lib/profileStorage';
export function useProfile() {
  const [state, setState] = useState(() => readProfile(browserStorage(), new Date()));
  const [message, setMessage] = useState('');
  const update = (draft: ProfileDraft, remember = state.remember) => {
    setState({draft, remember});
    setMessage(writeProfile(browserStorage(), draft, remember, new Date()) ? (remember ? 'Hồ sơ được nhớ khi ngày hợp lệ.' : 'Chỉ giữ trong phiên này.') : 'Chưa ghi hoặc xóa được dữ liệu trên máy. Bạn có thể thử lại.');
  };
  const clear = () => { update({...EMPTY_PROFILE}, false); };
  return {...state, update, clear, message, profile: calculateProfile(state.draft, new Date()),
    calculate: () => calculateProfile(state.draft, new Date())};
}
export type ProfileController = ReturnType<typeof useProfile>;
