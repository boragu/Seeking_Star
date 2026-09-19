export const gangwonSigunguCodes = [
  "110", // 춘천시
  "130", // 원주시
  "150", // 강릉시
  "170", // 동해시
  "190", // 태백시
  "210", // 속초시
  "230", // 삼척시
  "720", // 홍천군
  "730", // 횡성군
  "750", // 영월군
  "760", // 평창군
  "770", // 정선군
  "780", // 철원군
  "790", // 화천군
  "800", // 양구군
  "810", // 인제군
  "820", // 고성군
  "830", // 양양군
];

export const supportedRegions = Object.freeze({
  gangwon: {
    id: "gangwon",
    label: "강원특별자치도",
    tourAreaCode: "32",
    concentrationAreaCode: "51",
    concentrationSignguCode: "750",
    sigunguCodes: gangwonSigunguCodes,
  },
});

export const defaultRegion = supportedRegions.gangwon;

