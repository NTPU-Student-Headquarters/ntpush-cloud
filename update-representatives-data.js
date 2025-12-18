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

const OUTPUT_PATH = './server/api/student-representatives-data.ts';

async function fetchSheet(gid) {
  // 初始網址
  const initialUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
  
  return new Promise((resolve, reject) => {
    // 定義一個發送請求的函式，方便遞迴呼叫 (處理轉址)
    const sendRequest = (url) => {
      https.get(url, (res) => {
        // 情況 1: 遇到轉址 (狀態碼 301, 302, 307 等)
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // 遞迴呼叫：去抓新的網址
          sendRequest(res.headers.location);
          return;
        }

        // 情況 2: 發生錯誤 (狀態碼 400 以上)
        if (res.statusCode >= 400) {
          reject(new Error(`請求失敗，狀態碼: ${res.statusCode}`));
          return;
        }

        // 情況 3: 成功取得資料
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

function loadExistingData() {
  try {
    if (!fs.existsSync(OUTPUT_PATH)) {
      console.log('本地檔案不存在，將建立新檔案');
      return null;
    }

    const content = fs.readFileSync(OUTPUT_PATH, 'utf8');
    
    // 從檔案中提取 JSON 資料
    const jsonMatch = content.match(/return\s+(\{[\s\S]+\});/);
    if (!jsonMatch) {
      console.warn('無法解析現有檔案，將重新建立');
      return null;
    }

    const data = JSON.parse(jsonMatch[1]);
    
    // 移除 lastUpdated 以便比較純資料內容
    const { lastUpdated, ...dataWithoutTimestamp } = data;
    return dataWithoutTimestamp;
  } catch (err) {
    console.warn('讀取現有檔案時發生錯誤，將重新建立:', err.message);
    return null;
  }
}

function compareData(oldData, newData) {
  if (!oldData) return false; // 沒有舊資料，視為有變動
  
  // 深度比較（排除 lastUpdated）
  return JSON.stringify(oldData) === JSON.stringify(newData);
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

    const newData = {
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
    };

    console.log(`從試算表讀取: 會議 ${newData.meetings.length} 筆、個別學代 ${newData.representatives.length} 筆、推派人次 ${newData.assignments.length} 筆`);

    // 載入現有資料並比較
    const existingData = loadExistingData();
    const isSame = compareData(existingData, newData);

    if (isSame) {
      console.log('✓ 試算表內容無變動，跳過更新');
      console.log('本地檔案時間戳記保持不變');
      process.exit(0);
    }

    // 有變動，寫入新檔案（含更新時間戳記）
    console.log('⚠ 偵測到試算表內容變動，更新本地檔案');
    
    const dataWithTimestamp = {
      ...newData,
      lastUpdated: new Date().toISOString()
    };

    const content = `// server/api/student-representatives-data.ts
// Auto-generated file - Do not edit manually
// Last updated: ${dataWithTimestamp.lastUpdated}

export default defineEventHandler(() => {
  return ${JSON.stringify(dataWithTimestamp, null, 2)};
});
`;

    fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
    console.log('✓ 資料更新成功！');
    console.log(`更新時間: ${dataWithTimestamp.lastUpdated}`);
    process.exit(0);
    
  } catch (err) {
    console.error('❌ 執行過程發生錯誤：', err);
    process.exit(1);
  }
}

main();