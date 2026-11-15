import {isDirectionalQuestion} from '../answerRules';
import {cards} from '../../src/data';
import {imageryFor} from '../cardImagery';
import {GOLDEN_EXAMPLES} from './oldExamples';
import {randomUUID} from 'node:crypto';
import {hasPromptInjection} from '../inputSignals';
import {labelsOf, WANT_LABELS, DURATION_LABELS} from '../../src/lib/feelings';
import type { buildReadingContext } from '../../src/lib/readingContext';
import type { Input, Mode } from '../schema';
export const cleanText = (text: string) => text.replace(/[\t\n\r]/g, ' ').replace(/[\p{Cc}\p{Cf}]/gu, '').normalize('NFC');
export const escapeXml = (text: string) => cleanText(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const value = (text: string) => escapeXml(text.trim());
export function buildOldUserPrompt(ctx: ReturnType<typeof buildReadingContext>, input: Input, mode: Mode, _requestId: string = randomUUID()): string {
  const profile = ctx.profile;
  const example=GOLDEN_EXAMPLES[0];
  const profileXml = profile ? `<profile data_only="true">${profile.groups.map((group) =>
    `<group label="${({birth:'lá ngày sinh',year:'lá của năm nay',name:'lá từ tên bạn'})[group.via]}" via="${group.via}" number="${group.number}">${group.cards.map((card) => `<card id="${value(card.id)}" name="${value(card.name)}" number="${card.number}" role="${card.role}"><meaning>${value(card.meaning)}</meaning></card>`).join('')}</group>`).join('')}
<facets>${profile.facets.map((facet) => `<facet kind="${value(facet.kind)}" number="${facet.number}">${facet.lens ?
  `<essence>${value(facet.lens.essence)}</essence><gift>${value(facet.lens.gift)}</gift><shadow>${value(facet.lens.shadow)}</shadow><question>${value(facet.lens.question)}</question>` : '<unavailable>Chưa có nội dung; không suy diễn ý nghĩa số này.</unavailable>'}</facet>`).join('')}</facets>
<resonance>${profile.resonance.map((hit) => `<match card_id="${value(hit.cardId)}" name="${value(hit.name)}" via="${hit.via}" role="${hit.role}"/>`).join('')}</resonance></profile>` : '';
  return `<question_kind>${isDirectionalQuestion(input.question)?'yes/no':'open'}</question_kind>\n<canonical_names>${cards.map(c=>value(c.name_vi)).join('; ')}</canonical_names>\n<golden_example id="${example.id}">Chỉ để học nhịp và độ dài; tuyệt đối không dùng lại câu chữ, hình ảnh, hay cấu trúc câu. Ví dụ không phải dữ kiện hay quy tắc; mọi ràng buộc an toàn và schema hiện hành luôn ưu tiên.\n${value(example.text)}</golden_example>\n<style_card><closing_question_kind>về một lựa chọn cụ thể</closing_question_kind><experiment_kind>viết ngắn để làm rõ</experiment_kind><tension_form>một câu hỏi</tension_form><unsaid_form>bằng một cảm xúc cụ thể</unsaid_form></style_card>\n<mode>${mode}</mode>\n<reading_context><spread name="${value(ctx.spread.name)}">\n${ctx.positions.map((p) =>
    `<position number="${p.number}" name="${value(p.name)}" meaning="${value(p.meaning)}"><card name_vi="${value(p.card.name_vi)}" name_en="${value(p.card.name_en)}" orientation="${p.orientation}"${p.reversedMissing ? ' reversed_missing="true"' : ''}><imagery>Hình ảnh trên lá (chỉ dùng chi tiết này, không bịa thêm): ${value(imageryFor(p.card.id))}</imagery><arcana>${p.arcana}</arcana><suit_element>${value(p.suit_element)}</suit_element><symbols>${value(p.symbols.join(', '))}</symbols><keywords>${value(p.keywords.join(', '))}</keywords><meaning>${value(p.text)}</meaning></card></position>`
  ).join('\n')}\n</spread>${profileXml}</reading_context>\n<topic>${value(input.topic)}</topic>\n<question_empty>${!input.question.trim()}</question_empty>\n<injection_detected>${hasPromptInjection(input.question,input.context,input.feelings.other ?? '')}</injection_detected>\n<user_question>${value(input.question)}</user_question>\n<user_context>${value(input.context)}</user_context>\n<feelings data_only="true"><labels>${value(labelsOf(input.feelings.ids).join(', '))}</labels><other>${value(input.feelings.other ?? '')}</other><intensity>${input.feelings.intensity ?? ''}</intensity><want id="${input.feelings.want ?? ''}">${value(input.feelings.want ? WANT_LABELS[input.feelings.want] : '')}</want><duration id="${input.feelings.duration ?? ''}">${value(input.feelings.duration ? DURATION_LABELS[input.feelings.duration] : '')}</duration></feelings>`;
}
