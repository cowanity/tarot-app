// Usage: node scripts/audit_ui_text.mjs [baseline-root] [applied-edits.json]
// Reads source code only; never reads card/book JSON or user data.
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), baseline=path.resolve(process.argv[2]??root);
const applied=process.argv[3]?JSON.parse(fs.readFileSync(process.argv[3],'utf8')):[];
const files=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):/\.(tsx?|css)$/.test(e.name)&&!e.name.includes('.test.')?[path.join(dir,e.name)]:[]);
const normalize=s=>s.replace(/\s+/g,' ').trim();
const escaped=s=>String(s).replace(/\|/g,'\\|').replace(/\n/g,'<br>');
const rows=[]; const slots=[];
for(const file of files(path.join(baseline,'src')).filter(f=>/\.tsx?$/.test(f))){
 const source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 const rel=path.relative(baseline,file); const seen=new Set();
 const add=(node,text)=>{text=normalize(text);if(!text||seen.has(text))return;seen.add(text);rows.push({file:rel,line:source.getLineAndCharacterOfPosition(node.getStart()).line+1,text});};
 const visit=node=>{
  if(ts.isJsxText(node)) add(node,node.text);
  else if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)) {
   const uiAttr=ts.isJsxAttribute(node.parent)&&/^(?:title|placeholder|alt|aria-label|message)$/.test(node.parent.name.getText(source));
   if(uiAttr||/[À-ỹĐđ]/u.test(node.text))add(node,node.text);
  } else if(ts.isTemplateExpression(node)&&/[À-ỹĐđ]/u.test(node.getText(source)))add(node,node.getText(source).slice(1,-1));
  if(ts.isJsxExpression(node)&&node.expression&&!ts.isStringLiteral(node.expression)) {
   const code=node.expression.getText(source);
   if(code.length<180&&!/[;{}]/.test(code))slots.push({file:rel,line:source.getLineAndCharacterOfPosition(node.getStart()).line+1,text:code});
  }
  ts.forEachChild(node,visit);
 };visit(source);
}
const reason=text=>text.split(/\s+/).length>15?'Dài hơn 15 từ; cân nhắc rút gọn':/bổn mạng|khía cạnh|diễn giải|chiêm nghiệm|Ẩn Chính|Ẩn Phụ/i.test(text)?'Thuật ngữ cần cân nhắc':'Không có lỗi rõ; giữ nếu đúng ngữ cảnh';
const review=[
 ['src/components/ProfileSettings.tsx','Lá Bổn mạng','Lá theo ngày sinh','Dễ hiểu hơn, nhưng đổi thuật ngữ đã dùng xuyên suốt.'],
 ['src/components/ProfileSettings.tsx','Lá Năm tuổi','Lá của năm sinh nhật này','Rõ cách tính, nhưng nhãn dài hơn.'],
 ['src/components/ProfileSettings.tsx','Tâm hồn · Bài học · Món quà · Mục đích','Điều bên trong · Điều học hỏi · Điểm tựa · Hướng đi','Dễ đọc hơn nhưng có thể lệch tên khía cạnh của nguồn.'],
 ['src/screens/ResultScreen.tsx','Ẩn Chính · Ẩn Phụ','Nhóm chính · Nhóm theo chất bài','Giảm thuật ngữ, nhưng khó đối chiếu với thư viện lá.'],
 ['src/screens/SpreadScreen.tsx','Celtic Cross','Chữ thập Celtic','Dễ đọc hơn; cần thống nhất tên với dữ liệu và lịch sử.'],
];
let out='# Rà soát chữ giao diện\n\n';
out+='Phạm vi: chữ viết sẵn trong mã nguồn src, gồm nhãn, tiêu đề, thông báo, placeholder và trợ năng; không đọc src/data/*.json. Chuỗi động được liệt kê bằng vị trí hiển thị, không đưa nội dung sách hay dữ liệu người dùng vào báo cáo. Một số chuỗi trong hàm thuần là ứng viên cần đối chiếu với giao diện.\n\n';
out+='## Đã áp dụng\n\n| Vị trí | Chữ cũ | Vấn đề | Chữ mới |\n|---|---|---|---|\n';
for(const r of applied)out+=`| ${r.file} | ${escaped(r.old)} | Dài, mơ hồ hoặc lặp ý | ${escaped(r.new)} |\n`;
out+='| ConsentDialog / AiReadingPanel | Hộp đồng ý và chặn nút | Bước dư theo yêu cầu | Bỏ hộp thoại; bấm là chạy |\n| SettingsScreen | Trạng thái đồng ý / rút lại | Không còn phù hợp | Một dòng thông báo gửi câu hỏi đúng nội dung yêu cầu |\n| ResultScreen | headline | Có thể lặp câu trả lời | Dùng answer dưới dải lá bài |\n\n';
out+='## Năm chỗ còn phân vân — chưa đổi\n\n| Vị trí | Hiện tại | Đề xuất | Cần cân nhắc |\n|---|---|---|---|\n'+review.map(r=>'| '+r.map(escaped).join(' | ')+' |').join('\n')+'\n\n';
out+=`## Danh mục chữ trước khi sửa (${rows.length} mục)\n\n| Vị trí | Chữ hiện tại trước sửa | Vấn đề | Đề xuất / kết quả |\n|---|---|---|---|\n`;
for(const r of rows){const change=applied.find(c=>c.file===r.file&&c.old===r.text);out+=`| ${r.file}:${r.line} | ${escaped(r.text)} | ${reason(r.text)} | ${escaped(change?change.new:r.file.includes('ConsentDialog')?'Đã bỏ hộp thoại':'Giữ; không tự rút gọn nội dung an toàn, nguồn hoặc thuật ngữ')} |\n`;}
out+=`\n## Vị trí văn bản động (${slots.length} mục)\n\n| Vị trí | Biểu thức nguồn | Xử lý |\n|---|---|---|\n`+slots.map(r=>`| ${r.file}:${r.line} | ${escaped(r.text)} | Giữ liên kết dữ liệu; render text thuần |`).join('\n');
out+='\n\nCác câu nhắc an toàn, xác nhận xóa không thể hoàn tác, tên sách/tác giả và dòng quyền riêng tư được yêu cầu giữ đủ nghĩa, không áp trần 15 từ máy móc. PRIVACY.md và AI_FREE_TIER không đổi. Không gộp schema tension/weave/unsaid; prompt giảm lặp ý.\n';
fs.mkdirSync(path.join(root,'reports'),{recursive:true});fs.writeFileSync(path.join(root,'reports/UI_TEXT_REVIEW.md'),out);
console.log(JSON.stringify({staticStrings:rows.length,dynamicSlots:slots.length,applied:applied.length,undecided:review.length}));
