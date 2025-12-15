// update-representatives-data.js
import fs from 'node:fs';
import https from 'node:https';
import Papa from 'papaparse';

const SPREADSHEET_ID = '160GDmRWGq1_lM3w0gGgTPHdJG3hztyJog8rEIOFkaKs';

const SHEETS = {
  meetings: { gid: '329615512', name: '01-會議基本資料' },
  representatives: { gid: '163829263', name: '02-學代基本資料' },
  assignments: { gid: '1123889444', name: '03-會議學代名單' }
};

async function fetchSheet(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsed = Papa.parse(data, { header: true, skipEmptyLines: true });
        resolve(parsed.data);
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('正在讀取試算表資料...');
  
  const [meetings, representatives, assignments] = await Promise.all([
    fetchSheet(SHEETS.meetings.gid),
    fetchSheet(SHEETS.representatives.gid),
    fetchSheet(SHEETS.assignments.gid)
  ]);

  const data = {
    meetings: meetings.map(m => ({
      id: m['流水編號'],
      name: m['會議名稱(必填)'],
      link: m['會議資料連結'],
      department: m['承辦單位'],
      departmentLink: m['承辦單位連結'],
      totalSeats: m['本會法定可推派總額'],
      regulationArticle: m['本會推派辦法款次'],
      seatDistribution: m['席次分配'],
      sanxiaRegulation: m['三峽規則款次'],
      sanxiaMethod: m['三峽推派方式'],
      taipeiRegulation: m['臺北規則款次'],
      taipeiMethod: m['臺北推派方式'],
      otherMethod: m['其他推派方式'],
      note: m['備註']
    })).filter(m => m.name),
    
    representatives: representatives.map(r => ({
      id: r['流水編號'],
      name: r['姓名(必填)'],
      group: r['分組'],
      title: r['職稱'],
      department: r['系級'],
      note: r['備註']
    })).filter(r => r.name),
    
    assignments: assignments.map(a => ({
      id: a['流水編號'],
      meetingName: a['會議名稱(必填,須符合工作表01名稱)'],
      representativeName: a['學代姓名(必填,須符合工作表02姓名)']
    })).filter(a => a.meetingName && a.representativeName),
    
    lastUpdated: new Date().toISOString()
  };

  // 寫入檔案
  const outputPath = './server/api/student-representatives-data.ts';
  const content = `// Auto-generated file - Do not edit manually
// Last updated: ${data.lastUpdated}

export default defineEventHandler(() => {
  return ${JSON.stringify(data, null, 2)};
});
`;

  fs.writeFileSync(outputPath, content, 'utf8');
  console.log('資料更新成功！');
  console.log(`會議總數：${data.meetings.length}`);
  console.log(`學代總數：${data.representatives.length}`);
  console.log(`分配總數：${data.assignments.length}`);
}

main().catch(err => {
  console.error('錯誤：', err);
  process.exit(1);
});