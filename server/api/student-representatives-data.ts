// server/api/student-representatives-data.ts
// 這是初始範例檔案，實際資料將由 GitHub Actions 自動更新

export default defineEventHandler(() => {
  return {
    meetings: [
      {
        id: "1",
        name: "校務會議",
        link: "https://fms.ntpu.edu.tw/km/24761",
        department: "秘書室",
        departmentLink: "",
        totalSeats: "",
        regulationArticle: "",
        seatDistribution: "",
        sanxiaRegulation: "",
        sanxiaMethod: "",
        taipeiRegulation: "",
        taipeiMethod: "",
        otherMethod: "",
        note: "校務會議工作報告及檢討會議，資料請見 https://fms.ntpu.edu.tw/km/24762 。"
      },
      {
        id: "2",
        name: "學生申訴評議委員會",
        link: "non-public",
        department: "學務處",
        departmentLink: "https://new.ntpu.edu.tw/osa/members",
        totalSeats: "1",
        regulationArticle: "第3條第1項第15款",
        seatDistribution: "學生法官1名",
        sanxiaRegulation: "",
        sanxiaMethod: "",
        taipeiRegulation: "",
        taipeiMethod: "",
        otherMethod: "",
        note: "1. 全體學生法官依共識決推派（推派辦法第3條第4項）。\n2. 另有各學院推派學生代表共7名（屬院系所代表，不受本會監督），合計學生代表8名。"
      }
    ],
    representatives: [
      {
        id: "1",
        name: "周瑜芳",
        group: "碩博班代表",
        title: "X1",
        department: "社學碩4",
        note: ""
      },
      {
        id: "2",
        name: "林欣毅",
        group: "碩博班代表",
        title: "X1",
        department: "",
        note: ""
      },
      {
        id: "3",
        name: "周俊良",
        group: "學生法官",
        title: "學生法官",
        department: "公法碩1",
        note: ""
      }
    ],
    assignments: [
      {
        id: "1",
        meetingName: "校務會議",
        representativeName: "周瑜芳"
      },
      {
        id: "2",
        meetingName: "校務會議",
        representativeName: "林欣毅"
      },
      {
        id: "3",
        meetingName: "學生申訴評議委員會",
        representativeName: "周俊良"
      }
    ],
    lastUpdated: new Date().toISOString()
  };
});