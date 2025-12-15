// server/api/student-representatives.ts
export default defineEventHandler(async () => {
  try {
    // 從資料檔案讀取
    const data = await $fetch('/api/student-representatives-data');
    return data;
  } catch (error) {
    // 如果資料檔案還不存在，返回空資料
    return {
      meetings: [],
      representatives: [],
      assignments: [],
      lastUpdated: new Date().toISOString()
    };
  }
});