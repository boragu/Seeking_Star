export const gangwonSigunguCodes = [
  "51110", // 춘천시
  "51130", // 원주시
  "51150", // 강릉시
  "51170", // 동해시
  "51190", // 태백시
  "51210", // 속초시
  "51230", // 삼척시
  "51720", // 홍천군
  "51730", // 횡성군
  "51750", // 영월군
  "51760", // 평창군
  "51770", // 정선군
  "51780", // 철원군
  "51790", // 화천군
  "51800", // 양구군
  "51810", // 인제군
  "51820", // 고성군
  "51830", // 양양군
];

export const supportedRegions = Object.freeze({
  gangwon: {
    id: "gangwon",
    label: "강원특별자치도",
    tourAreaCode: "32",
    concentrationAreaCode: "51",
    concentrationSignguCode: "51750",
    sigunguCodes: gangwonSigunguCodes,
  },
});

export const defaultRegion = supportedRegions.gangwon;
