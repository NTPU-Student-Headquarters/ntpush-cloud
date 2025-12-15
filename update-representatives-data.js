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
  // 初始網址
  const initialUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
  
  return new Promise((resolve, reject) => {
    // 定義一個發送請求的函式，方便遞迴呼叫 (處理轉址)
    const sendRequest = (url) => {
      https.get(url, (res) => {
        // 情況 A: 遇到轉址 (狀態碼 301, 302, 307 等)
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // 遞迴呼叫：去抓新的網址
          sendRequest(res.headers.location);
          return;
        }

        // 情況 B: 發生錯誤 (狀態碼 400 以上)
        if (res.statusCode >= 400) {
          reject(new Error(`請求失敗，狀態碼: ${res.statusCode}`));
          return;
        }

        // 情況 C: 成功取得資料
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          // 解析 CSV
          const parsed = Papa.parse(data, { header: false, skipEmptyLines: true });
        
        // 移除第一列 (標題列)，只回傳數據部分
        // 資料從第二列開始，故 slice(1)
          const dataRows = parsed.data.length > 0 ? parsed.data.slice(1) : [];
          resolve(dataRows);
        });
      }).on('error', reject);
    };

    // 開始第一次請求
    sendRequest(initialUrl);
  });
}

async function main() {
  console.log('正在讀取試算表資料...');
  
  try {
    const [meetings, representatives, assignments] = await Promise.all([
      fetchSheet(SHEETS.meetings.gid),
      fetchSheet(SHEETS.representatives.gid),
      fetchSheet(SHEETS.assignments.gid)
    ]);

  // 務必確認 Google Spreadsheets 欄位順序如下：
  // 各機關官方帳號均有修改權限，如誤修改請協助其復原

    const data = {
    // 對應工作表: 01-會議基本資料
      meetings: meetings.map(m => ({
      id: m[0],                 // A欄: 流水編號
      name: m[1],               // B欄: 會議名稱
      link: m[2],               // C欄: 會議資料連結
      department: m[3],         // D欄: 承辦單位
      departmentLink: m[4],     // E欄: 承辦單位連結
      totalSeats: m[5],         // F欄: 本會法定可推派總額
      regulationArticle: m[6],  // G欄: 本會推派辦法款次
      seatDistribution: m[7],   // H欄: 席次分配
      sanxiaRegulation: m[8],   // I欄: 三峽規則款次
      sanxiaMethod: m[9],       // J欄: 三峽推派方式
      taipeiRegulation: m[10],  // K欄: 臺北規則款次
      taipeiMethod: m[11],      // L欄: 臺北推派方式
      otherMethod: m[12],       // M欄: 其他推派方式
      note: m[13]               // N欄: 備註
    })).filter(m => m.name),    // 確保B欄(會議名稱)有值才保留
      
    // 對應工作表: 02-學代基本資料
      representatives: representatives.map(r => ({
      group: r[0],              // A欄: 分組
      id: r[1],                 // B欄: 流水編號
      name: r[2],               // C欄: 姓名
      title: r[3],              // D欄: 職稱
      department: r[4],         // E欄: 系級
      note: r[5]                // F欄: 備註
    })).filter(r => r.name),    // 確保 C欄有值才保留
      
    // 對應工作表: 03-會議學代名單
      assignments: assignments.map(a => ({
      id: a[0],                 // A欄: 流水編號
      meetingName: a[1],        // B欄: 會議名稱
      representativeName: a[2]  // C欄: 學代姓名
    })).filter(a => a.meetingName && a.representativeName), // 確保 B、C欄都有值
      
      lastUpdated: new Date().toISOString()
    };

    // 寫入檔案
    const outputPath = './server/api/student-representatives-data.ts';
    const content = `// server/api/student-representatives-data.ts
// Auto-generated file - Do not edit manually
// Last updated: ${data.lastUpdated}

export default defineEventHandler(() => {
  return ${JSON.stringify(data, null, 2)};
});
`;

    fs.writeFileSync(outputPath, content, 'utf8');
    console.log('資料更新成功！');
    console.log(`匯入會議資料筆數：${data.meetings.length}`);
    console.log(`匯入學代基本資料筆數：${data.representatives.length}`);
    console.log(`匯入推派筆數：${data.assignments.length}`);
    process.exit(0);
    
  } catch (err) {
    console.error('執行過程發生錯誤：', err);
    process.exit(1);
  }
}

main();