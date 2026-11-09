export const JOBS = ["프론트엔드", "백엔드", "모바일 앱", "데이터 분석", "UI/UX", "서비스 기획"];

// 화면 표기와 DB의 job_roles.name이 달라서 id를 찾을 때 씀
export const JOB_ROLE_NAMES: Record<string, string> = {
  프론트엔드: "프론트엔드 개발자",
  백엔드: "백엔드 개발자",
  "모바일 앱": "모바일 앱 개발자",
  "데이터 분석": "데이터 분석가",
  "UI/UX": "UI/UX 디자이너",
  "서비스 기획": "서비스 기획자",
};
