import type {
  Center,
  Class,
  Session,
  Student,
  Enrollment,
  Attendance,
  StudentNote,
  ClassReport,
  SpecialRequest,
  CommentSnippet,
  User,
  ChecklistItem,
  PeriodicCommentSchedule,
  StudentSessionMetrics,
  ParentCommunication,
  StudentPhoto,
  Guideline, // Added import for Guideline
  SystemConfig, // Added import for SystemConfig
} from "./types"

// Vietnamese teacher and TA name pools for realistic data
const teacherNames = [
  "Mr. Phong Ngô",
  "Ms. Hương Trần",
  "Mr. Tuấn Lê",
  "Ms. Linh Nguyễn",
  "Mr. Đức Võ",
  "Ms. Hà Phan",
  "Mr. Nam Hoàng",
  "Ms. Thảo Đặng",
  "Mr. Minh Bùi",
  "Ms. Chi Vũ",
]

const taNames = [
  "Mr. Yên Nguyễn",
  "Ms. Trang Phạm",
  "Ms. Lan Trương",
  "Mr. Khoa Đinh",
  "Ms. My Dương",
  "Mr. Hải Lý",
  "Ms. Anh Lưu",
  "Mr. Bình Trịnh",
  "Ms. Thu Huỳnh",
  "Mr. Long Phan",
]

// Centers - All 69 VUS centers across Vietnam
export const mockCenters: Center[] = [
  // Bình Dương (BDG) - 6 centers
  {
    id: "BDG_CMT8",
    code: "BDG_CMT8",
    name: "Bình Dương - Cách Mạng Tháng 8",
    nameVN: "Bình Dương - Cách Mạng Tháng 8",
    location: "78 Cách Mạng Tháng Tám, Phường Thủ Dầu Một",
    zone: "SEP",
  },
  {
    id: "BDG_DA",
    code: "BDG_DA",
    name: "Bình Dương - Dĩ An",
    nameVN: "Bình Dương - Dĩ An",
    location: "Số 22 đường M, Khu TTHC, khu phố Nhị Đồng 2, Phường Dĩ An",
    zone: "SEP",
  },
  {
    id: "BDG_DA2",
    code: "BDG_DA2",
    name: "Bình Dương - Dĩ An 2",
    nameVN: "Bình Dương - Dĩ An 2",
    location: "Số 17-19 Đường số 9, Khu đô thị TTHC, Khu phố Nhị Đồng 2, Phường Dĩ An",
    zone: "SEP",
  },
  {
    id: "BDG_DLBD",
    code: "BDG_DLBD",
    name: "Bình Dương - Đại Lộ Bình Dương",
    nameVN: "Bình Dương - Đại Lộ Bình Dương",
    location: "438 Đại lộ Bình Dương, Khu phố 2, Phường Bến Cát",
    zone: "SEP",
  },
  {
    id: "BDG_NVT",
    code: "BDG_NVT",
    name: "Bình Dương - Nguyễn Văn Tiết",
    nameVN: "Bình Dương - Nguyễn Văn Tiết",
    location: "23 Nguyễn Văn Tiết, Phường Lái Thiêu",
    zone: "SEP",
  },
  {
    id: "BDG_TDM",
    code: "BDG_TDM",
    name: "Bình Dương - Thủ Dầu Một",
    nameVN: "Bình Dương - Thủ Dầu Một",
    location: "Số 306 Đại lộ Bình Dương, khu phố 01, Phường Phú Lợi",
    zone: "SEP",
  },

  // Other Provinces
  {
    id: "BDH_LL",
    code: "BDH_LL",
    name: "Bình Định - Lê Lợi",
    nameVN: "Bình Định - Lê Lợi",
    location: "49 - 51 Đường Lê Lợi, Phường Quy Nhơn",
    zone: "SCP",
  },
  {
    id: "BMT_PBC",
    code: "BMT_PBC",
    name: "Buôn Ma Thuột - Phan Bội Châu",
    nameVN: "Buôn Ma Thuột - Phan Bội Châu",
    location: "Số 06 Phan Bội Châu, Phường Buôn Ma Thuột",
    zone: "SCP",
  },
  {
    id: "BRV_LHP",
    code: "BRV_LHP",
    name: "Vũng Tàu - Lê Hồng Phong",
    nameVN: "Vũng Tàu - Lê Hồng Phong",
    location: "142-144 Lê Hồng Phong",
    zone: "SEP",
  },
  {
    id: "BRV_NTT",
    code: "BRV_NTT",
    name: "Bà Rịa - Nguyễn Tất Thành",
    nameVN: "Bà Rịa - Nguyễn Tất Thành",
    location: "Số 122A Nguyễn Tất Thành, Phường Bà Rịa",
    zone: "SEP",
  },
  {
    id: "CTO_NT",
    code: "CTO_NT",
    name: "Cần Thơ - Nguyễn Trãi",
    nameVN: "Cần Thơ - Nguyễn Trãi",
    location: "Số 38A-38B đường Nguyễn Trãi, Phường Ninh Kiều",
    zone: "SCP",
  },
  {
    id: "DNA_DBP",
    code: "DNA_DBP",
    name: "Đà Nẵng - Điện Biên Phủ",
    nameVN: "Đà Nẵng - Điện Biên Phủ",
    location: "Số 233 – 235 Điện Biên Phủ, Phường Thanh Khê",
    zone: "SCP",
  },

  // Đồng Nai (DNI) - 5 centers
  {
    id: "DNI_HV",
    code: "DNI_HV",
    name: "Đồng Nai - Hùng Vương",
    nameVN: "Đồng Nai - Hùng Vương",
    location: "244-246 Hùng Vương, Phường Long Khánh",
    zone: "SEP",
  },
  {
    id: "DNI_LD",
    code: "DNI_LD",
    name: "Đồng Nai - Lê Duẩn",
    nameVN: "Đồng Nai - Lê Duẩn",
    location: "159-161-163 Lê Duẩn, Khu Phước Hải, Xã Long Thành",
    zone: "SEP",
  },
  {
    id: "DNI_PT",
    code: "DNI_PT",
    name: "Đồng Nai - Phan Trung",
    nameVN: "Đồng Nai - Phan Trung",
    location: "240 Phan Trung, Phường Tân Mai",
    zone: "SEP",
  },
  {
    id: "DNI_QL1A",
    code: "DNI_QL1A",
    name: "Đồng Nai - Quốc lộ 1A",
    nameVN: "Đồng Nai - Quốc lộ 1A",
    location: "Số 213 – 215 đường Võ Thị Sáu, Khu Phố 7, Phường Trấn Biên",
    zone: "SEP",
  },
  {
    id: "DNI_VTS",
    code: "DNI_VTS",
    name: "Đồng Nai - Võ Thị Sáu",
    nameVN: "Đồng Nai - Võ Thị Sáu",
    location: "Số 213 – 215 đường Võ Thị Sáu, Khu Phố 7, Phường Trấn Biên",
    zone: "SEP",
  },

  {
    id: "GLI_PDP",
    code: "GLI_PDP",
    name: "Gia Lai - Phan Đình Phùng",
    nameVN: "Gia Lai - Phan Đình Phùng",
    location: "96A+96B Phan Đình Phùng, Phường Pleiku",
    zone: "SCP",
  },

  // Hồ Chí Minh (HCM) - 47 centers
  {
    id: "HCM_ADV",
    code: "HCM_ADV",
    name: "Hồ Chí Minh - An Dương Vương",
    nameVN: "Hồ Chí Minh - An Dương Vương",
    location: "129-131-133-135-137 An Dương Vương, Phường An Đông",
    zone: "HCMC",
  },
  {
    id: "HCM_BL",
    code: "HCM_BL",
    name: "Hồ Chí Minh - Bình Long",
    nameVN: "Hồ Chí Minh - Bình Long",
    location: "285 Bình Long, Khu phố 5, phường Bình Hưng Hòa",
    zone: "HCMC",
  },
  {
    id: "HCM_BM",
    code: "HCM_BM",
    name: "Hồ Chí Minh - Bình Minh",
    nameVN: "Hồ Chí Minh - Bình Minh",
    location: "706A Xa lộ Hà Nội, Phường Tăng Nhơn Phú",
    zone: "HCMC",
  },
  {
    id: "HCM_CH",
    code: "HCM_CH",
    name: "Hồ Chí Minh - Cộng Hòa",
    nameVN: "Hồ Chí Minh - Cộng Hòa",
    location: "107 Cộng Hòa, Phường Bảy Hiền",
    zone: "HCMC",
  },
  {
    id: "HCM_DXH",
    code: "HCM_DXH",
    name: "Hồ Chí Minh - Đỗ Xuân Hợp",
    nameVN: "Hồ Chí Minh - Đỗ Xuân Hợp",
    location: "167, Khu phố 2, đường Đỗ Xuân Hợp, Phường Phước Long",
    zone: "HCMC",
  },
  {
    id: "HCM_GR",
    code: "HCM_GR",
    name: "Hồ Chí Minh - Green River",
    nameVN: "Hồ Chí Minh - Green River",
    location: "Tầng 2 (lầu 1), chung cư Green River, 2252 Phạm Thế Hiển, phường 6, quận 8",
    zone: "HCMC",
  },
  {
    id: "HCM_HB",
    code: "HCM_HB",
    name: "Hồ Chí Minh - Hòa Bình",
    nameVN: "Hồ Chí Minh - Hòa Bình",
    location: "45B Hòa Bình, Phường Tân Phú",
    zone: "HCMC",
  },
  {
    id: "HCM_HG",
    code: "HCM_HG",
    name: "Hồ Chí Minh - Hậu Giang",
    nameVN: "Hồ Chí Minh - Hậu Giang",
    location: "Tầng trệt và Tầng lửng Block A, Chung cư An Phú 2, 961-973/1 Hậu Giang, Phường Bình Phú",
    zone: "HCMC",
  },
  {
    id: "HCM_HTP",
    code: "HCM_HTP",
    name: "Hồ Chí Minh - Huỳnh Tấn Phát",
    nameVN: "Hồ Chí Minh - Huỳnh Tấn Phát",
    location: "1389 Huỳnh Tấn Phát, Phường Phú Thuận",
    zone: "HCMC",
  },
  {
    id: "HCM_KDV",
    code: "HCM_KDV",
    name: "Hồ Chí Minh - Kinh Dương Vương",
    nameVN: "Hồ Chí Minh - Kinh Dương Vương",
    location: "131-133-135-137 An Dương Vương, Phường Phú Lâm",
    zone: "HCMC",
  },
  {
    id: "HCM_KH",
    code: "HCM_KH",
    name: "Hồ Chí Minh - Khánh Hội",
    nameVN: "Hồ Chí Minh - Khánh Hội",
    location: "243-245 Khánh Hội, Phường Khánh Hội",
    zone: "HCMC",
  },
  {
    id: "HCM_LQD",
    code: "HCM_LQD",
    name: "Hồ Chí Minh - Lê Quang Định",
    nameVN: "Hồ Chí Minh - Lê Quang Định",
    location: "367-369 Lê Quang Định, Phường Bình Lợi Trung",
    zone: "HCMC",
  },
  {
    id: "HCM_LTT",
    code: "HCM_LTT",
    name: "Hồ Chí Minh - Lê Trọng Tấn",
    nameVN: "Hồ Chí Minh - Lê Trọng Tấn",
    location: "475D Lê Trọng Tấn, KCN Tân Bình, Phường Tây Thạnh",
    zone: "HCMC",
  },
  {
    id: "HCM_LVL",
    code: "HCM_LVL",
    name: "Hồ Chí Minh - Lê Văn Lương",
    nameVN: "Hồ Chí Minh - Lê Văn Lương",
    location: "Số 850 Lê Văn Lương, Ấp 5, Xã Nhà Bè",
    zone: "SCP",
  },
  {
    id: "HCM_MS",
    code: "HCM_MS",
    name: "Hồ Chí Minh - Morning Star",
    nameVN: "Hồ Chí Minh - Morning Star",
    location: "Tầng trệt và tầng lửng 1, Chung cư Morning Star, 57 Quốc lộ 13, Phường Bình Thạnh",
    zone: "HCMC",
  },
  {
    id: "HCM_NAT",
    code: "HCM_NAT",
    name: "Hồ Chí Minh - Nguyễn Ảnh Thủ",
    nameVN: "Hồ Chí Minh - Nguyễn Ảnh Thủ",
    location: "1113 đường Nguyễn Ảnh Thủ, Khu phố 3, Phường Trung Mỹ Tây",
    zone: "HCMC",
  },
  {
    id: "HCM_NAT2",
    code: "HCM_NAT2",
    name: "Hồ Chí Minh - Nguyễn Ảnh Thủ 2",
    nameVN: "Hồ Chí Minh - Nguyễn Ảnh Thủ 2",
    location: "2/1 Nguyễn Ảnh Thủ, Phường Tân Thới Hiệp",
    zone: "HCMC",
  },
  {
    id: "HCM_NCT",
    code: "HCM_NCT",
    name: "Hồ Chí Minh - Nguyễn Chí Thanh",
    nameVN: "Hồ Chí Minh - Nguyễn Chí Thanh",
    location: "282 Nguyễn Chí Thanh, Phường Diên Hồng",
    zone: "HCMC",
  },
  {
    id: "HCM_NDT",
    code: "HCM_NDT",
    name: "Hồ Chí Minh - Nguyễn Duy Trinh",
    nameVN: "Hồ Chí Minh - Nguyễn Duy Trinh",
    location: "223-225 Nguyễn Duy Trinh, Khu phố 1, Phường Bình Trưng",
    zone: "HCMC",
  },
  {
    id: "HCM_NHT",
    code: "HCM_NHT",
    name: "Hồ Chí Minh - Nguyễn Hữu Trí",
    nameVN: "Hồ Chí Minh - Nguyễn Hữu Trí",
    location: "263 Nguyễn Hữu Trí, Khu phố 5, Xã Tân Nhựt",
    zone: "HCMC",
  },
  {
    id: "HCM_NK2",
    code: "HCM_NK2",
    name: "Hồ Chí Minh - Nguyễn Kiệm 2",
    nameVN: "Hồ Chí Minh - Nguyễn Kiệm 2",
    location: "988 Nguyễn Kiệm, Phường Hạnh Thông",
    zone: "HCMC",
  },
  {
    id: "HCM_NKV",
    code: "HCM_NKV",
    name: "Hồ Chí Minh - Nguyễn Khắc Viện",
    nameVN: "Hồ Chí Minh - Nguyễn Khắc Viện",
    location: "25-27-29 Nguyễn Khắc Viện, Phường Tân Mỹ",
    zone: "HCMC",
  },
  {
    id: "HCM_NO",
    code: "HCM_NO",
    name: "Hồ Chí Minh - Nguyễn Oanh",
    nameVN: "Hồ Chí Minh - Nguyễn Oanh",
    location: "632-636 Nguyễn Oanh, Phường 6, Q.Gò Vấp",
    zone: "HCMC",
  },
  {
    id: "HCM_NTMK",
    code: "HCM_NTMK",
    name: "HCM - Nguyễn Thị Minh Khai",
    nameVN: "HCM - Nguyễn Thị Minh Khai",
    location: "189 Nguyễn Thị Minh Khai, Phường Bến Thành",
    zone: "HCMC",
  },
  {
    id: "HCM_NTT",
    code: "HCM_NTT",
    name: "Hồ Chí Minh - Nguyễn Thị Thập",
    nameVN: "Hồ Chí Minh - Nguyễn Thị Thập",
    location: "Số 73 - 75 - 77, đường Nguyễn Thị Thập, Khu đô thị mới Him L, Phường Tân Hưng",
    zone: "HCMC",
  },
  {
    id: "HCM_NVTA",
    code: "HCM_NVTA",
    name: "Hồ Chí Minh - Nguyễn Văn Tăng",
    nameVN: "Hồ Chí Minh - Nguyễn Văn Tăng",
    location: "55A-57 Nguyễn Văn Tăng, phường Long Bình",
    zone: "HCMC",
  },
  {
    id: "HCM_NVTH",
    code: "HCM_NVTH",
    name: "Hồ Chí Minh - Nguyễn Văn Thủ",
    nameVN: "Hồ Chí Minh - Nguyễn Văn Thủ",
    location: "209 Nguyễn Văn Thủ, Phường Sài Gòn",
    zone: "HCMC",
  },
  {
    id: "HCM_OL",
    code: "HCM_OL",
    name: "Hồ Chí Minh - Online",
    nameVN: "Hồ Chí Minh - Online",
    location: "189 Nguyễn Thị Minh Khai, P. Phạm Ngũ Lão, Q.1",
    zone: "HCMC",
  },
  {
    id: "HCM_PVD",
    code: "HCM_PVD",
    name: "Hồ Chí Minh - Phạm Văn Đồng",
    nameVN: "Hồ Chí Minh - Phạm Văn Đồng",
    location: "Hồ Chí Minh - Phạm Văn Đồng",
    zone: "HCMC",
  },
  {
    id: "HCM_PVH",
    code: "HCM_PVH",
    name: "Hồ Chí Minh - Phan Văn Hớn",
    nameVN: "Hồ Chí Minh - Phan Văn Hớn",
    location: "Hồ Chí Minh - Phan Văn Hớn",
    zone: "HCMC",
  },
  {
    id: "HCM_PXL",
    code: "HCM_PXL",
    name: "Hồ Chí Minh - Phan Xích Long",
    nameVN: "Hồ Chí Minh - Phan Xích Long",
    location: "420-422-424 Phan Xích Long, Phường Cầu Kiệu",
    zone: "HCMC",
  },
  {
    id: "HCM_QT",
    code: "HCM_QT",
    name: "Hồ Chí Minh - Quang Trung",
    nameVN: "Hồ Chí Minh - Quang Trung",
    location: "Số 651-651B, Đường Quang Trung, Phường Thông Tây Hội",
    zone: "HCMC",
  },
  {
    id: "HCM_TC",
    code: "HCM_TC",
    name: "Hồ Chí Minh - Trường Chinh",
    nameVN: "Hồ Chí Minh - Trường Chinh",
    location: "187 Trường Chinh, Phường Đông Hưng Thuận",
    zone: "HCMC",
  },
  {
    id: "HCM_TK2",
    code: "HCM_TK2",
    name: "Hồ Chí Minh - Tô Ký 2",
    nameVN: "Hồ Chí Minh - Tô Ký 2",
    location: "30/13 ấp Nam Thới, xã Đông Thạnh",
    zone: "HCMC",
  },
  {
    id: "HCM_TL",
    code: "HCM_TL",
    name: "Hồ Chí Minh - Tên Lửa",
    nameVN: "Hồ Chí Minh - Tên Lửa",
    location: "104-104A, Đường Tên Lửa, Phường An Lạc",
    zone: "HCMC",
  },
  {
    id: "HCM_TL8",
    code: "HCM_TL8",
    name: "Hồ Chí Minh - Củ Chi Tỉnh Lộ 8",
    nameVN: "Hồ Chí Minh - Củ Chi Tỉnh Lộ 8",
    location: "Số 94 Tỉnh lộ 8, Ấp 1, Xã Phú Hòa Đông",
    zone: "HCMC",
  },
  {
    id: "HCM_TL8_2",
    code: "HCM_TL8-2",
    name: "HCM - Củ Chi Tỉnh Lộ 8 - 02",
    nameVN: "HCM - Củ Chi Tỉnh Lộ 8 - 02",
    location: "222 Tỉnh lộ 8, Khu phố 2, Xã Tân An Hội",
    zone: "HCMC",
  },
  {
    id: "HCM_TN2",
    code: "HCM_TN2",
    name: "Hồ Chí Minh - Trần Não 2",
    nameVN: "Hồ Chí Minh - Trần Não 2",
    location: "111 Trần Não, Khu phố 4, Phường An Khánh",
    zone: "HCMC",
  },
  {
    id: "HCM_TNV",
    code: "HCM_TNV",
    name: "Hồ Chí Minh - Tô Ngọc Vân",
    nameVN: "Hồ Chí Minh - Tô Ngọc Vân",
    location: "485 Tô Ngọc Vân, Phường Tam Bình",
    zone: "HCMC",
  },
  {
    id: "HCM_TQB",
    code: "HCM_TQB",
    name: "Hồ Chí Minh – Tạ Quang Bửu",
    nameVN: "Hồ Chí Minh – Tạ Quang Bửu",
    location: "Số 825A-827 Tạ Quang Bửu, Phường Bình Đông",
    zone: "HCMC",
  },
  {
    id: "HCM_UT",
    code: "HCM_UT",
    name: "Hồ Chí Minh - Út Tịch",
    nameVN: "Hồ Chí Minh - Út Tịch",
    location: "201/36A Út Tịch, Phường Tân Sơn Nhất",
    zone: "HCMC",
  },
  {
    id: "HCM_VVN",
    code: "HCM_VVN",
    name: "Hồ Chí Minh - Võ Văn Ngân",
    nameVN: "Hồ Chí Minh - Võ Văn Ngân",
    location: "Số 93-95 và 91/5 Võ Văn Ngân, Khu phố 2, Phường Thủ Đức",
    zone: "HCMC",
  },
  {
    id: "HCM_VVV",
    code: "HCM_VVV",
    name: "Hồ Chí Minh - Võ Văn Vân",
    nameVN: "Hồ Chí Minh - Võ Văn Vân",
    location: "26G Võ Văn Vân, Ấp A4, Xã Vĩnh Lộc B, Bình Chánh",
    zone: "HCMC",
  },

  // Other Provinces
  {
    id: "KGG_BTH",
    code: "KGG_BTH",
    name: "Kiên Giang - Ba Tháng Hai",
    nameVN: "Kiên Giang - Ba Tháng Hai",
    location: "Lô B14, Đường 3 Tháng 2, Phường Rạch Giá",
    zone: "SCP",
  },
  {
    id: "KHA_LTP",
    code: "KHA_LTP",
    name: "Khánh Hòa - Lê Thành Phương",
    nameVN: "Khánh Hòa - Lê Thành Phương",
    location: "55 Lê Thành Phương, Phường Tây Nha Trang",
    zone: "SCP",
  },
  {
    id: "LAN_MTT",
    code: "LAN_MTT",
    name: "Long An - Mai Thị Tốt",
    nameVN: "Long An - Mai Thị Tốt",
    location: "01 Mai Thị Tốt, Phường Tân An",
    zone: "SCP",
  },
  {
    id: "LDG_PDP",
    code: "LDG_PDP",
    name: "Lâm Đồng - Phan Đình Phùng",
    nameVN: "Lâm Đồng - Phan Đình Phùng",
    location: "Số 208 - 210 Phan Đình Phùng, Phường Xuân Hương - Đà Lạt",
    zone: "SCP",
  },
  {
    id: "QNI_PDP",
    code: "QNI_PDP",
    name: "Quảng Ngãi - Phan Đình Phùng",
    nameVN: "Quảng Ngãi - Phan Đình Phùng",
    location: "Số 134 Phan Đình Phùng, Phường Cẩm Thành",
    zone: "SCP",
  },
  {
    id: "TGG_NKKN",
    code: "TGG_NKKN",
    name: "Tiền Giang - Nam Kỳ Khởi Nghĩa",
    nameVN: "Tiền Giang - Nam Kỳ Khởi Nghĩa",
    location: "Số 210 Nam Kỳ Khởi Nghĩa, Phường Mỹ Tho",
    zone: "SCP",
  },
  {
    id: "TNH_304",
    code: "TNH_304",
    name: "Tây Ninh - Ba mươi tháng tư",
    nameVN: "Tây Ninh - Ba mươi tháng tư",
    location: "Số 410 Đường 30/4, Khu phố 1, Phường Tân Ninh",
    zone: "SEP",
  },
  {
    id: "VLG_PTB",
    code: "VLG_PTB",
    name: "Vĩnh Long - Phạm Thái Bường",
    nameVN: "Vĩnh Long - Phạm Thái Bường",
    location: "Số 56/2 Phạm Thái Bường, Khóm 1, Phường Phước Hậu",
    zone: "SCP",
  },
]

// Classes
export const mockClasses: Class[] = [
  {
    id: "cls-1",
    centerId: "HCM_NTMK",
    code: "HK6p_Aa2501N",
    program: "Happy Kids",
    level: "HK6 Part",
    shift: "Morning",
    status: "Active",
    startDate: "2025-01-06",
    endDate: "2025-03-28",
    teacherId: "usr-teacher-1",
    taIds: ["usr-ta-1"],
    studentCount: 12,
    riskLevel: "Green",
  },
  {
    id: "cls-2",
    centerId: "HCM_NTMK",
    code: "SKG1s_Bb2501N",
    program: "Super Kids",
    level: "SKG1 Summer",
    shift: "Afternoon",
    status: "Active",
    startDate: "2025-01-08",
    endDate: "2025-04-02",
    teacherId: "usr-teacher-2",
    taIds: ["usr-ta-2"],
    studentCount: 15,
    riskLevel: "Yellow",
  },
  {
    id: "cls-3",
    centerId: "HCM_PXL",
    code: "YLC2_Ab2502N",
    program: "Young Leader",
    level: "YLC2",
    shift: "Evening",
    status: "Active",
    startDate: "2025-01-10",
    endDate: "2025-04-10",
    teacherId: "usr-teacher-3",
    taIds: ["usr-ta-3"],
    studentCount: 10,
    riskLevel: "Green",
  },
  {
    id: "cls-4",
    centerId: "HCM_NTMK",
    code: "HK4p_Ba2501N",
    program: "Happy Kids",
    level: "HK4 Part",
    shift: "Morning",
    status: "Active",
    startDate: "2025-01-07",
    endDate: "2025-03-30",
    teacherId: "usr-teacher-1",
    taIds: ["usr-ta-1"],
    studentCount: 8,
    riskLevel: "Red",
  },
  {
    id: "cls-5",
    centerId: "HCM_PXL",
    code: "SKG3p_Ca2502N",
    program: "Super Kids",
    level: "SKG3 Part",
    shift: "Afternoon",
    status: "Active",
    startDate: "2025-01-09",
    endDate: "2025-04-05",
    teacherId: "usr-teacher-3",
    taIds: ["usr-ta-4"],
    studentCount: 13,
    riskLevel: "Green",
  },
  {
    id: "cls-7",
    centerId: "HCM_PXL",
    code: "HK4p_Ca2501N",
    program: "Happy Kids",
    level: "HK4 Part",
    shift: "Morning",
    status: "Active",
    startDate: "2025-01-12",
    endDate: "2025-04-05",
    teacherId: "usr-teacher-1",
    taIds: ["usr-ta-1"],
    studentCount: 13,
    riskLevel: "Green",
  },
  {
    id: "cls-8",
    centerId: "HCM_CH",
    code: "SKG2p_Aa2502N",
    program: "Super Kids",
    level: "SKG2 Part",
    shift: "Afternoon",
    status: "Active",
    startDate: "2025-01-14",
    endDate: "2025-04-08",
    teacherId: "usr-teacher-2",
    taIds: ["usr-ta-3"],
    studentCount: 12,
    riskLevel: "Yellow",
  },
  {
    id: "cls-9",
    centerId: "HCM_VVN",
    code: "YLA1_Ba2501N",
    program: "Young Leader",
    level: "YLA1",
    shift: "Evening",
    status: "Active",
    startDate: "2025-01-11",
    endDate: "2025-04-12",
    teacherId: "usr-teacher-3",
    taIds: ["usr-ta-4"],
    studentCount: 12,
    riskLevel: "Green",
  },
  {
    id: "cls-10",
    centerId: "HCM_ADV",
    code: "HK6p_Ba2502N",
    program: "Happy Kids",
    level: "HK6 Part",
    shift: "Afternoon",
    status: "Active",
    startDate: "2025-01-13",
    endDate: "2025-04-06",
    teacherId: "usr-teacher-1",
    taIds: ["usr-ta-2"],
    studentCount: 13,
    riskLevel: "Green",
  },
  {
    id: "cls-11",
    centerId: "HCM_BL",
    code: "SKG1s_Da2501N",
    program: "Super Kids",
    level: "SKG1 Summer",
    shift: "Morning",
    status: "Active",
    startDate: "2025-01-15",
    endDate: "2025-04-10",
    teacherId: "usr-teacher-2",
    taIds: ["usr-ta-1"],
    studentCount: 12,
    riskLevel: "Green",
  },
  {
    id: "cls-12",
    centerId: "HCM_HB",
    code: "YLC2_Ca2502N",
    program: "Young Leader",
    level: "YLC2",
    shift: "Evening",
    status: "Active",
    startDate: "2025-01-16",
    endDate: "2025-04-15",
    teacherId: "usr-teacher-3",
    taIds: ["usr-ta-3"],
    studentCount: 13,
    riskLevel: "Yellow",
  },
  {
    id: "cls-13",
    centerId: "HCM_KH",
    code: "HK4p_Da2501N",
    program: "Happy Kids",
    level: "HK4 Part",
    shift: "Morning",
    status: "Active",
    startDate: "2025-01-17",
    endDate: "2025-04-11",
    teacherId: "usr-teacher-1",
    taIds: ["usr-ta-4"],
    studentCount: 12,
    riskLevel: "Green",
  },
  {
    id: "cls-14",
    centerId: "HCM_LQD",
    code: "SKG3p_Ba2501N",
    program: "Super Kids",
    level: "SKG3 Part",
    shift: "Afternoon",
    status: "Active",
    startDate: "2025-01-18",
    endDate: "2025-04-13",
    teacherId: "usr-teacher-2",
    taIds: ["usr-ta-2"],
    studentCount: 13,
    riskLevel: "Green",
  },
  {
    id: "cls-15",
    centerId: "HCM_NO",
    code: "YLB1_Ea2502N",
    program: "Young Leader",
    level: "YLB1",
    shift: "Evening",
    status: "Active",
    startDate: "2025-01-19",
    endDate: "2025-04-14",
    teacherId: "usr-teacher-3",
    taIds: ["usr-ta-1"],
    studentCount: 12,
    riskLevel: "Red",
  },
  {
    id: "cls-16",
    centerId: "HCM_TN2",
    code: "SKG2p_Ca2501N",
    program: "Super Kids",
    level: "SKG2 Part",
    shift: "Morning",
    status: "Active",
    startDate: "2025-01-20",
    endDate: "2025-04-16",
    teacherId: "usr-teacher-2",
    taIds: ["usr-ta-3"],
    studentCount: 13,
    riskLevel: "Green",
  },
]

// Helper to calculate start time based on VUS schedule rules
const getStartTimeForDate = (date: Date): string => {
  const dayOfWeek = date.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday

  // Monday-Friday (1-5): Classes start at 17:00 (5 PM)
  // Saturday-Sunday (0,6): Classes start at 08:00 (8 AM)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return "08:00"
  } else {
    return "17:00"
  }
}

// Helper to determine session status based on date
const getSessionStatus = (
  scheduledDate: string,
): { status: Session["status"]; hasReport: boolean; actualDate?: string } => {
  const today = new Date("2025-02-03") // Current date in the mock data
  const sessionDate = new Date(scheduledDate)

  if (sessionDate < today) {
    return { status: "Completed", hasReport: true, actualDate: scheduledDate }
  } else if (sessionDate.toDateString() === today.toDateString()) {
    return { status: "InProgress", hasReport: false }
  } else {
    return { status: "Scheduled", hasReport: false }
  }
}

// Sessions (12 total across classes)
export const mockSessions: Session[] = (() => {
  const sessions: Session[] = []

  // Keep the original 12 sessions with updated teacher/TA info and dynamic status
  sessions.push(
    {
      id: "ses-1",
      classId: "cls-1",
      sessionNumber: 1,
      scheduledDate: "2025-01-06",
      ...getSessionStatus("2025-01-06"),
      startTime: getStartTimeForDate(new Date("2025-01-06")),
      endTime: "10:00",
      topic: "Greetings & Introductions",
      lessonTitle: "Happy & Healthy",
      lessonObjectives: "Students will identify and name common body parts.",
      bookPages: "10-15",
      unitNumber: "Unit 3",
      homeAssignment: "Practice greeting family members in English",
      teacherName: "Mr. Phong Ngô",
      taName: "Mr. Yên Nguyễn",
    },
    {
      id: "ses-2",
      classId: "cls-1",
      sessionNumber: 2,
      scheduledDate: "2025-01-13",
      ...getSessionStatus("2025-01-13"),
      startTime: getStartTimeForDate(new Date("2025-01-13")),
      endTime: "10:00",
      topic: "Present Perfect Tense",
      lessonTitle: "My Hobbies",
      lessonObjectives: "Students will use present perfect tense to describe experiences.",
      bookPages: "16-20",
      unitNumber: "Unit 4",
      homeAssignment: "Write 5 sentences using present perfect",
      teacherName: "Mr. Phong Ngô",
      taName: "Mr. Yên Nguyễn",
    },
    {
      id: "ses-3",
      classId: "cls-1",
      sessionNumber: 3,
      scheduledDate: "2025-01-20",
      ...getSessionStatus("2025-01-20"),
      startTime: getStartTimeForDate(new Date("2025-01-20")),
      endTime: "10:00",
      topic: "Describing People",
      lessonTitle: "My Family",
      lessonObjectives: "Students will describe physical appearance and personality traits.",
      bookPages: "21-25",
      unitNumber: "Unit 5",
      homeAssignment: "Draw and describe a family member",
      teacherName: "Mr. Phong Ngô",
      taName: "Mr. Yên Nguyễn",
    },
    // Continue with other original sessions...
    {
      id: "ses-4",
      classId: "cls-2",
      sessionNumber: 1,
      scheduledDate: "2025-01-07",
      ...getSessionStatus("2025-01-07"),
      startTime: getStartTimeForDate(new Date("2025-01-07")),
      endTime: "16:00",
      topic: "Animals & Habitats",
      lessonTitle: "Where Animals Live",
      lessonObjectives: "Students will identify different animal habitats and characteristics.",
      bookPages: "8-12",
      unitNumber: "Unit 2",
      homeAssignment: "Draw your favorite animal and its home",
      teacherName: "Ms. Hương Trần",
      taName: "Ms. Trang Phạm",
    },
    {
      id: "ses-5",
      classId: "cls-2",
      sessionNumber: 2,
      scheduledDate: "2025-01-14",
      ...getSessionStatus("2025-01-14"),
      startTime: getStartTimeForDate(new Date("2025-01-14")),
      endTime: "16:00",
      topic: "Numbers & Counting",
      lessonTitle: "Count with Me",
      lessonObjectives: "Students will count objects from 1-20 and recognize number words.",
      bookPages: "13-17",
      unitNumber: "Unit 3",
      homeAssignment: "Count toys at home and tell parents in English",
      teacherName: "Ms. Hương Trần",
      taName: "Ms. Trang Phạm",
    },
    {
      id: "ses-6",
      classId: "cls-3",
      sessionNumber: 1,
      scheduledDate: "2025-01-08",
      ...getSessionStatus("2025-01-08"),
      startTime: getStartTimeForDate(new Date("2025-01-08")),
      endTime: "18:00",
      topic: "Leadership Skills",
      lessonTitle: "Being a Leader",
      lessonObjectives: "Students will identify qualities of effective leaders and practice teamwork.",
      bookPages: "45-50",
      unitNumber: "Unit 8",
      homeAssignment: "Interview a leader in your community",
      teacherName: "Mr. Tuấn Lê",
      taName: "Mr. Long Trần",
    },
    {
      id: "ses-7",
      classId: "cls-3",
      sessionNumber: 2,
      scheduledDate: "2025-01-15",
      ...getSessionStatus("2025-01-15"),
      startTime: getStartTimeForDate(new Date("2025-01-15")),
      endTime: "18:00",
      topic: "Environmental Issues",
      lessonTitle: "Protecting Our Planet",
      lessonObjectives: "Students will discuss environmental problems and propose solutions.",
      bookPages: "51-55",
      unitNumber: "Unit 9",
      homeAssignment: "Research one environmental issue and present findings",
      teacherName: "Mr. Tuấn Lê",
      taName: "Mr. Long Trần",
    },
    {
      id: "ses-8",
      classId: "cls-4",
      sessionNumber: 1,
      scheduledDate: "2025-01-09",
      ...getSessionStatus("2025-01-09"),
      startTime: getStartTimeForDate(new Date("2025-01-09")),
      endTime: "10:00",
      topic: "Colors & Shapes",
      lessonTitle: "My Colorful World",
      lessonObjectives: "Students will identify basic colors and shapes in their environment.",
      bookPages: "5-9",
      unitNumber: "Unit 1",
      homeAssignment: "Find 3 objects of each color at home",
      teacherName: "Ms. Linh Nguyễn",
      taName: "Ms. Chi Lê",
    },
    {
      id: "ses-9",
      classId: "cls-5",
      sessionNumber: 1,
      scheduledDate: "2025-01-10",
      ...getSessionStatus("2025-01-10"),
      startTime: getStartTimeForDate(new Date("2025-01-10")),
      endTime: "16:00",
      topic: "School Subjects",
      lessonTitle: "What We Learn",
      lessonObjectives: "Students will name different school subjects and express preferences.",
      bookPages: "18-22",
      unitNumber: "Unit 4",
      homeAssignment: "Create a weekly class schedule",
      teacherName: "Mr. Khoa Pham",
      taName: "Mr. Nam Vũ",
    },
    {
      id: "ses-10",
      classId: "cls-7", // Corrected from cls-6 to cls-7 based on mockClasses
      sessionNumber: 1,
      scheduledDate: "2025-01-11",
      ...getSessionStatus("2025-01-11"),
      startTime: getStartTimeForDate(new Date("2025-01-11")),
      endTime: "18:00",
      topic: "Technology & Innovation",
      lessonTitle: "Future Tech",
      lessonObjectives: "Students will discuss how technology impacts daily life and predict future innovations.",
      bookPages: "60-65",
      unitNumber: "Unit 10",
      homeAssignment: "Design an invention that solves a problem",
      teacherName: "Ms. Mai Võ",
      taName: "Ms. Hà Đỗ",
    },
    {
      id: "ses-11",
      classId: "cls-1",
      sessionNumber: 4,
      scheduledDate: "2025-01-27",
      ...getSessionStatus("2025-01-27"),
      startTime: getStartTimeForDate(new Date("2025-01-27")),
      endTime: "10:00",
      topic: "Past Simple Tense",
      lessonTitle: "My Weekend",
      lessonObjectives: "Students will use past simple tense to describe past events.",
      bookPages: "26-30",
      unitNumber: "Unit 6",
      homeAssignment: "Write about what you did last weekend",
      teacherName: "Mr. Phong Ngô",
      taName: "Mr. Yên Nguyễn",
    },
    {
      id: "ses-12",
      classId: "cls-2",
      sessionNumber: 3,
      scheduledDate: "2025-01-21",
      ...getSessionStatus("2025-01-21"),
      startTime: getStartTimeForDate(new Date("2025-01-21")),
      endTime: "16:00",
      topic: "Weather & Seasons",
      lessonTitle: "Sunny Days",
      lessonObjectives: "Students will identify different weather conditions and seasons.",
      bookPages: "18-22",
      unitNumber: "Unit 4",
      homeAssignment: "Draw a picture of your favorite season",
      teacherName: "Ms. Hương Trần",
      taName: "Ms. Trang Phạm",
    },
  )

  // Generate sessions for all 16 classes (24 sessions each)
  mockClasses.forEach((cls, classIndex) => {
    const teacher = teacherNames[classIndex % teacherNames.length]
    const ta = taNames[classIndex % taNames.length]
    const startDate = new Date(cls.startDate)

    for (let i = 1; i <= 24; i++) {
      // Skip if session already exists in the original 12
      if (sessions.find((s) => s.classId === cls.id && s.sessionNumber === i)) {
        continue
      }

      const sessionDate = new Date(startDate)
      sessionDate.setDate(sessionDate.getDate() + (i - 1) * 7) // Weekly sessions

      // Determine topics based on program type
      let topic = ""
      let bookPages = ""
      let unitNumber = ""
      let lessonTitle = ""
      let lessonObjectives = ""
      let homeAssignment = ""

      if (cls.program === "Happy Kids") {
        const hkTopics = [
          {
            topic: "Colors & Shapes",
            pages: "2-5",
            unit: "Unit 1",
            title: "My Colorful World",
            obj: "Identify basic colors and shapes",
            hw: "Find colorful objects at home",
          },
          {
            topic: "Family Members",
            pages: "6-9",
            unit: "Unit 2",
            title: "I Love My Family",
            obj: "Name family members and relationships",
            hw: "Draw your family tree",
          },
          {
            topic: "Body Parts",
            pages: "10-13",
            unit: "Unit 3",
            title: "Head, Shoulders, Knees",
            obj: "Identify and name body parts",
            hw: "Sing body parts song with parents",
          },
          {
            topic: "Animals",
            pages: "14-17",
            unit: "Unit 4",
            title: "Animal Friends",
            obj: "Recognize and name common animals",
            hw: "Bring toy animal to class",
          },
          {
            topic: "Food & Drinks",
            pages: "18-21",
            unit: "Unit 5",
            title: "Yummy Food",
            obj: "Name favorite foods and drinks",
            hw: "Tell parents about favorite food",
          },
          {
            topic: "Toys",
            pages: "22-25",
            unit: "Unit 6",
            title: "My Favorite Toys",
            obj: "Describe toys using adjectives",
            hw: "Share a toy with family",
          },
          {
            topic: "Weather",
            pages: "26-29",
            unit: "Unit 7",
            title: "Sunny Days",
            obj: "Identify weather conditions",
            hw: "Draw today's weather",
          },
          {
            topic: "Numbers 1-10",
            pages: "30-33",
            unit: "Unit 8",
            title: "Count with Me",
            obj: "Count objects from 1-10",
            hw: "Count toys at home",
          },
        ]
        const topicData = hkTopics[(i - 1) % hkTopics.length]
        topic = topicData.topic
        bookPages = topicData.pages
        unitNumber = topicData.unit
        lessonTitle = topicData.title
        lessonObjectives = topicData.obj
        homeAssignment = topicData.hw
      } else if (cls.program === "Super Kids") {
        const skTopics = [
          {
            topic: "Greetings & Introductions",
            pages: "4-8",
            unit: "Unit 1",
            title: "Nice to Meet You",
            obj: "Introduce themselves and greet others",
            hw: "Practice introductions with 3 people",
          },
          {
            topic: "School Subjects",
            pages: "9-13",
            unit: "Unit 2",
            title: "My Favorite Class",
            obj: "Name school subjects and express preferences",
            hw: "Create weekly schedule",
          },
          {
            topic: "Sports & Hobbies",
            pages: "14-18",
            unit: "Unit 3",
            title: "What I Like to Do",
            obj: "Discuss hobbies and sports activities",
            hw: "Interview family about hobbies",
          },
          {
            topic: "Daily Routines",
            pages: "19-23",
            unit: "Unit 4",
            title: "My Day",
            obj: "Describe daily activities using time expressions",
            hw: "Write about your morning routine",
          },
          {
            topic: "Food & Nutrition",
            pages: "24-28",
            unit: "Unit 5",
            title: "Healthy Eating",
            obj: "Discuss healthy food choices",
            hw: "Plan a healthy meal",
          },
          {
            topic: "Animals & Habitats",
            pages: "29-33",
            unit: "Unit 6",
            title: "Where Animals Live",
            obj: "Describe animal habitats and characteristics",
            hw: "Research one wild animal",
          },
          {
            topic: "Places in Town",
            pages: "34-38",
            unit: "Unit 7",
            title: "Around My City",
            obj: "Name community places and directions",
            hw: "Draw map of your neighborhood",
          },
          {
            topic: "Seasons & Weather",
            pages: "39-43",
            unit: "Unit 8",
            title: "Four Seasons",
            obj: "Describe weather and seasonal activities",
            hw: "Write about favorite season",
          },
        ]
        const topicData = skTopics[(i - 1) % skTopics.length]
        topic = topicData.topic
        bookPages = topicData.pages
        unitNumber = topicData.unit
        lessonTitle = topicData.title
        lessonObjectives = topicData.obj
        homeAssignment = topicData.hw
      } else {
        // Young Leader
        const ylTopics = [
          {
            topic: "Communication Skills",
            pages: "5-10",
            unit: "Unit 1",
            title: "Effective Communication",
            obj: "Practice active listening and clear speaking",
            hw: "Record a 2-minute speech",
          },
          {
            topic: "Critical Thinking",
            pages: "11-16",
            unit: "Unit 2",
            title: "Think Critically",
            obj: "Analyze arguments and form opinions",
            hw: "Write opinion essay (200 words)",
          },
          {
            topic: "Team Collaboration",
            pages: "17-22",
            unit: "Unit 3",
            title: "Working Together",
            obj: "Demonstrate teamwork and conflict resolution",
            hw: "Complete group project plan",
          },
          {
            topic: "Technology & Society",
            pages: "23-28",
            unit: "Unit 4",
            title: "Digital World",
            obj: "Discuss technology's impact on society",
            hw: "Research tech innovation",
          },
          {
            topic: "Environmental Issues",
            pages: "29-34",
            unit: "Unit 5",
            title: "Protecting Our Planet",
            obj: "Propose solutions to environmental problems",
            hw: "Create awareness poster",
          },
          {
            topic: "Global Citizenship",
            pages: "35-40",
            unit: "Unit 6",
            title: "World Citizens",
            obj: "Understand cultural diversity and global issues",
            hw: "Research another country's culture",
          },
          {
            topic: "Leadership",
            pages: "41-46",
            unit: "Unit 7",
            title: "Being a Leader",
            obj: "Identify leadership qualities and practice them",
            hw: "Interview a community leader",
          },
          {
            topic: "Media Literacy",
            pages: "47-52",
            unit: "Unit 8",
            title: "Understanding Media",
            obj: "Analyze media messages critically",
            hw: "Compare two news articles",
          },
        ]
        const topicData = ylTopics[(i - 1) % ylTopics.length]
        topic = topicData.topic
        bookPages = topicData.pages
        unitNumber = topicData.unit
        lessonTitle = topicData.title
        lessonObjectives = topicData.obj
        homeAssignment = topicData.hw
      }

      const statusResult = getSessionStatus(sessionDate.toISOString().split("T")[0])
      const status: "Scheduled" | "InProgress" | "Completed" | "Cancelled" = statusResult.status
      const hasReport = statusResult.hasReport
      const actualDate = statusResult.actualDate

      sessions.push({
        id: `ses-${sessions.length + 1}`,
        classId: cls.id,
        sessionNumber: i,
        scheduledDate: sessionDate.toISOString().split("T")[0],
        status,
        hasReport,
        actualDate,
        startTime: getStartTimeForDate(sessionDate), // Use the helper function
        endTime: cls.shift === "Morning" ? "10:00" : cls.shift === "Afternoon" ? "16:00" : "18:00",
        topic,
        bookPages,
        unitNumber,
        lessonTitle,
        lessonObjectives,
        homeAssignment,
        teacherName: teacher,
        taName: ta,
      })
    }
  })

  return sessions
})()

// Students (60 total)
export const mockStudents: Student[] = [
  // Class 1 students (HK6p) - Ages 4-6
  {
    id: "stu-1",
    fullName: "Nguyễn Minh Anh",
    avatar: "/vietnamese-kid-4-6-girl-1.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2019-03-15",
    phoneNumber: "+84900000001",
    email: "minhanh@example.com",
    guardianName: "Nguyễn Văn Hùng",
    guardianPhone: "+84910000001",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-2",
    fullName: "Trần Hoàng Bảo",
    avatar: "/vietnamese-kid-4-6-boy-1.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2019-07-22",
    phoneNumber: "+84900000002",
    email: "baolong@example.com",
    guardianName: "Trần Thị Mai",
    guardianPhone: "+84910000002",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-3",
    fullName: "Lê Thị Cẩm",
    avatar: "/vietnamese-kid-4-6-girl-2.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2019-05-10",
    phoneNumber: "+84900000003",
    email: "huong@example.com",
    guardianName: "Lê Văn Toàn",
    guardianPhone: "+84910000003",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Yellow",
    isNewStudent: false,
  },
  {
    id: "stu-4",
    fullName: "Phạm Đức Dũng",
    avatar: "/vietnamese-kid-4-6-boy-2.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2019-09-03",
    phoneNumber: "+84900000004",
    email: "kiet@example.com",
    guardianName: "Phạm Thị Lan",
    guardianPhone: "+84910000004",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-5",
    fullName: "Hoàng Thị Linh",
    avatar: "/vietnamese-kid-4-6-girl-3.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2019-11-28",
    phoneNumber: "+84900000005",
    email: "linh@example.com",
    guardianName: "Hoàng Thị Nga",
    guardianPhone: "+84910000005",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-6",
    fullName: "Vũ Quốc Khánh",
    avatar: "/vietnamese-kid-4-6-boy-3.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2020-02-14",
    phoneNumber: "+84900000006",
    email: "khanh@example.com",
    guardianName: "Vũ Văn Nam",
    guardianPhone: "+84910000006",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-7",
    fullName: "Đặng Thanh Mai",
    avatar: "/vietnamese-kid-4-6-girl-4.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2020-06-19",
    phoneNumber: "+84900000007",
    email: "quocbao@example.com",
    guardianName: "Đặng Văn Phong",
    guardianPhone: "+84910000007",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-8",
    fullName: "Bùi Văn Nam",
    avatar: "/vietnamese-kid-4-6-boy-4.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2020-08-07",
    phoneNumber: "+84900000008",
    email: "tam@example.com",
    guardianName: "Bùi Thị Quỳnh",
    guardianPhone: "+84910000008",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Red",
    isNewStudent: false,
  },
  {
    id: "stu-9",
    fullName: "Phan Thị Oanh",
    avatar: "/vietnamese-kid-4-6-girl-5.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2020-04-25",
    phoneNumber: "+84900000009",
    email: "han@example.com",
    guardianName: "Phan Văn Sơn",
    guardianPhone: "+84910000009",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-10",
    fullName: "Trịnh Minh Phúc",
    avatar: "/vietnamese-kid-4-6-boy-5.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2020-10-12",
    phoneNumber: "+84900000010",
    email: "tu@example.com",
    guardianName: "Trịnh Thị Thảo",
    guardianPhone: "+849100010",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Red",
    isNewStudent: false,
  },
  {
    id: "stu-11",
    fullName: "Ngô Thị Quỳnh",
    avatar: "/vietnamese-kid-4-6-girl-6.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2020-01-30",
    phoneNumber: "+84900000011",
    email: "phucan@example.com",
    guardianName: "Ngô Văn Trung",
    guardianPhone: "+849100011",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-12",
    fullName: "Lý Tuấn Anh",
    avatar: "/vietnamese-kid-4-6-boy-6.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2020-12-05",
    phoneNumber: "+84900000012",
    email: "van@example.com",
    guardianName: "Lý Thị Xuân",
    guardianPhone: "+849100012",
    enrollmentDate: "2024-12-01",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },

  // Class 2 students (SKG1s) - Ages 6-12
  {
    id: "stu-13",
    fullName: "Mai Thị Hương",
    avatar: "/vietnamese-kid-6-12-girl-1.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-03-20",
    phoneNumber: "+84900000013",
    email: "chau@example.com",
    guardianName: "Mai Văn Đức",
    guardianPhone: "+849100013",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-14",
    fullName: "Đỗ Văn Tài",
    avatar: "/vietnamese-kid-6-12-boy-1.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-05-15",
    phoneNumber: "+84900000014",
    email: "duyen@example.com",
    guardianName: "Đỗ Thị Em",
    guardianPhone: "+849100014",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-15",
    fullName: "Võ Thị Uyên",
    avatar: "/vietnamese-kid-6-12-girl-2.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-07-08",
    phoneNumber: "+84900000015",
    email: "giang@example.com",
    guardianName: "Võ Văn Hải",
    guardianPhone: "+849100015",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Yellow",
    isNewStudent: false,
  },
  {
    id: "stu-16",
    fullName: "Cao Minh Vũ",
    avatar: "/vietnamese-kid-6-12-boy-2.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-02-28",
    phoneNumber: "+84900000016",
    email: "hieu@example.com",
    guardianName: "Cao Thị Hoa",
    guardianPhone: "+849100016",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-17",
    fullName: "Dương Thị Xuân",
    avatar: "/vietnamese-kid-6-12-girl-3.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-09-12",
    phoneNumber: "+84900000017",
    email: "ha@example.com",
    guardianName: "Dương Văn Khoa",
    guardianPhone: "+849100017",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-18",
    fullName: "Hồ Văn Yên",
    avatar: "/vietnamese-kid-6-12-boy-3.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-11-05",
    phoneNumber: "+84900000018",
    email: "long@example.com",
    guardianName: "Hồ Thị Liên",
    guardianPhone: "+849100018",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-19",
    fullName: "Tô Thị Ánh",
    avatar: "/vietnamese-kid-6-12-girl-4.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-04-22",
    phoneNumber: "+84900000019",
    email: "mai@example.com",
    guardianName: "Tô Văn Minh",
    guardianPhone: "+849100019",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-20",
    fullName: "Lâm Văn Bình",
    avatar: "/vietnamese-kid-6-12-boy-4.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-06-17",
    phoneNumber: "+84900000020",
    email: "giabao@example.com",
    guardianName: "Lâm Thị Nga",
    guardianPhone: "+849100020",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Red",
    isNewStudent: false,
  },
  {
    id: "stu-21",
    fullName: "Châu Thị Chinh",
    avatar: "/vietnamese-kid-6-12-girl-5.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-08-30",
    phoneNumber: "+84900000021",
    email: "phuong@example.com",
    guardianName: "Châu Văn Quang",
    guardianPhone: "+849100021",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-22",
    fullName: "Đinh Văn Đạt",
    avatar: "/vietnamese-kid-6-12-boy-5.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-01-14",
    phoneNumber: "+84900000022",
    email: "quan@example.com",
    guardianName: "Đinh Thị Thủy",
    guardianPhone: "+849100022",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-23",
    fullName: "Kim Thị Lan",
    avatar: "/vietnamese-kid-6-12-girl-6.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-10-25",
    phoneNumber: "+84900000023",
    email: "ngoc@example.com",
    guardianName: "Kim Văn Sáng",
    guardianPhone: "+849100023",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-24",
    fullName: "Nguyễn Văn Phong",
    avatar: "/vietnamese-kid-6-12-boy-6.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-03-08",
    phoneNumber: "+84900000024",
    email: "thang@example.com",
    guardianName: "Nguyễn Thị Tâm",
    guardianPhone: "+849100024",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-25",
    fullName: "Trần Thị Mỹ",
    avatar: "/vietnamese-kid-6-12-girl-7.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-12-19",
    phoneNumber: "+84900000025",
    email: "tuyet@example.com",
    guardianName: "Trần Văn Uyên",
    guardianPhone: "+849100025",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Yellow",
    isNewStudent: false,
  },
  {
    id: "stu-26",
    fullName: "Lê Văn Hùng",
    avatar: "/vietnamese-kid-6-12-boy-7.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-05-03",
    phoneNumber: "+84900000026",
    email: "vinh@example.com",
    guardianName: "Lê Thị Vân",
    guardianPhone: "+849100026",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-27",
    fullName: "Phạm Thị Nhung",
    avatar: "/vietnamese-kid-6-12-girl-8.jpg", // Updated to age-appropriate avatar
    dateOfBirth: "2018-07-21",
    phoneNumber: "+84900000027",
    email: "xuan@example.com",
    guardianName: "Phạm Văn Yên",
    guardianPhone: "+849100027",
    enrollmentDate: "2025-01-08",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },

  // Class 3 students (YLC2) - Ages 11-15
  {
    id: "stu-28",
    fullName: "Hoàng Văn Sơn",
    avatar: "/vietnamese-teen-11-15-boy-1.jpg", // Updated to teen avatar
    dateOfBirth: "2012-04-10",
    phoneNumber: "+84900000028",
    email: "hoanganh@example.com",
    guardianName: "Hoàng Thị Bình",
    guardianPhone: "+849100028",
    enrollmentDate: "2025-01-10",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-29",
    fullName: "Vũ Thị Thảo",
    avatar: "/vietnamese-teen-11-15-girl-1.jpg", // Updated to teen avatar
    dateOfBirth: "2012-06-25",
    phoneNumber: "+84900000029",
    email: "cuong@example.com",
    guardianName: "Vũ Văn Giang",
    guardianPhone: "+849100029",
    enrollmentDate: "2025-01-10",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-30",
    fullName: "Đặng Văn Tuấn",
    avatar: "/vietnamese-teen-11-15-boy-2.jpg", // Updated to teen avatar
    dateOfBirth: "2012-08-14",
    phoneNumber: "+84900000030",
    email: "duc@example.com",
    guardianName: "Đặng Thị Hương",
    guardianPhone: "+849100030",
    enrollmentDate: "2025-01-10",
    status: "Active",
    riskLevel: "Red",
    isNewStudent: false,
  },
  {
    id: "stu-31",
    fullName: "Bùi Thị Uyên",
    avatar: "/vietnamese-teen-11-15-girl-2.jpg", // Updated to teen avatar
    dateOfBirth: "2012-02-03",
    phoneNumber: "+84900000031",
    email: "hang@example.com",
    guardianName: "Bùi Văn Lâm",
    guardianPhone: "+849100031",
    enrollmentDate: "2025-01-10",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-32",
    fullName: "Phan Văn Vũ",
    avatar: "/vietnamese-teen-11-15-boy-3.jpg", // Updated to teen avatar
    dateOfBirth: "2012-11-28",
    phoneNumber: "+84900000032",
    email: "khoa@example.com",
    guardianName: "Phan Thị Mỹ",
    guardianPhone: "+849100032",
    enrollmentDate: "2025-01-10",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-33",
    fullName: "Trịnh Thị Thảo",
    avatar: "/vietnamese-teen-11-15-girl-3.jpg", // Updated to teen avatar
    dateOfBirth: "2012-09-17",
    phoneNumber: "+84900000033",
    email: "thuylinh@example.com",
    guardianName: "Trịnh Văn Phúc",
    guardianPhone: "+849100033",
    enrollmentDate: "2025-01-10",
    status: "Active",
    riskLevel: "Yellow",
    isNewStudent: false,
  },
  {
    id: "stu-34",
    fullName: "Ngô Văn Yên",
    avatar: "/vietnamese-teen-11-15-boy-4.jpg", // Updated to teen avatar
    dateOfBirth: "2012-05-30",
    phoneNumber: "+84900000034",
    email: "nam@example.com",
    guardianName: "Ngô Thị Quỳnh",
    guardianPhone: "+849100034",
    enrollmentDate: "2025-01-10",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-35",
    fullName: "Lý Thị An",
    avatar: "/vietnamese-teen-11-15-girl-4.jpg", // Updated to teen avatar
    dateOfBirth: "2012-12-22",
    phoneNumber: "+84900000035",
    email: "phuong@example.com",
    guardianName: "Lý Văn Bình",
    guardianPhone: "+849100035",
    enrollmentDate: "2025-01-10",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  // Class 3 students continue, with updated avatars as per the pattern
  {
    id: "stu-36",
    fullName: "Mai Văn Bình",
    avatar: "/vietnamese-teen-11-15-boy-5.jpg", // Updated to teen avatar
    dateOfBirth: "2012-03-15",
    phoneNumber: "+84900000036",
    email: "vietanh@example.com",
    guardianName: "Mai Thị Thanh",
    guardianPhone: "+849100036",
    enrollmentDate: "2025-01-10",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-37",
    fullName: "Đỗ Thị Chi",
    avatar: "/vietnamese-teen-11-15-girl-5.jpg", // Updated to teen avatar
    dateOfBirth: "2012-07-08",
    phoneNumber: "+84900000037",
    email: "trang@example.com",
    guardianName: "Đỗ Thị Thảo",
    guardianPhone: "+849100037",
    enrollmentDate: "2025-01-10",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },

  // Class 4 students (HK4p) - Ages 4-6
  {
    id: "stu-38",
    fullName: "Võ Văn Dũng",
    avatar: "/vietnamese-kid-4-6-boy-7.jpg", // Added HK student avatar, adjusted for age
    dateOfBirth: "2019-01-20", // Updated from 2018 to 2019 for HK age range
    phoneNumber: "+84900000038",
    email: "minhanh2@example.com",
    guardianName: "Võ Thị Bảo",
    guardianPhone: "+849100038",
    enrollmentDate: "2025-01-07",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-39",
    fullName: "Cao Thị Em",
    avatar: "/vietnamese-kid-4-6-girl-7.jpg", // Added HK student avatar, adjusted for age
    dateOfBirth: "2019-04-12", // Updated to 2019
    phoneNumber: "+84900000039",
    email: "bao@example.com",
    guardianName: "Cao Văn Châu",
    guardianPhone: "+849100039",
    enrollmentDate: "2025-01-07",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-40",
    fullName: "Dương Văn Phúc",
    avatar: "/vietnamese-kid-4-6-boy-8.jpg", // Added HK student avatar, adjusted for age
    dateOfBirth: "2019-06-28", // Updated to 2019
    phoneNumber: "+84900000040",
    email: "duyen2@example.com",
    guardianName: "Dương Thị Em",
    guardianPhone: "+849100040",
    enrollmentDate: "2025-01-07",
    status: "Active",
    riskLevel: "Red",
    isNewStudent: false,
  },
  {
    id: "stu-41",
    fullName: "Hồ Thị Giang",
    avatar: "/vietnamese-kid-4-6-girl-8.jpg", // Added HK student avatar, adjusted for age
    dateOfBirth: "2019-08-14", // Updated to 2019
    phoneNumber: "+84900000041",
    email: "giang2@example.com",
    guardianName: "Hồ Văn Hoài",
    guardianPhone: "+849100041",
    enrollmentDate: "2025-01-07",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-42",
    fullName: "Tô Văn Hưng",
    avatar: "/vietnamese-kid-4-6-boy-9.jpg", // Added HK student avatar, adjusted for age
    dateOfBirth: "2019-10-03", // Updated to 2019
    phoneNumber: "+84900000042",
    email: "nam2@example.com",
    guardianName: "Tô Thị Lan",
    guardianPhone: "+849100042",
    enrollmentDate: "2025-01-07",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-43",
    fullName: "Lâm Thị Yến",
    avatar: "/vietnamese-kid-4-6-girl-9.jpg", // Added HK student avatar, adjusted for age
    dateOfBirth: "2019-12-19", // Updated to 2019
    phoneNumber: "+84900000043",
    email: "phuong2@example.com",
    guardianName: "Lâm Văn Quang",
    guardianPhone: "+849100043",
    enrollmentDate: "2025-01-07",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-44",
    fullName: "Châu Văn Khôi",
    avatar: "/vietnamese-kid-4-6-boy-10.jpg", // Added HK student avatar, adjusted for age
    dateOfBirth: "2020-02-28", // Updated to 2020
    phoneNumber: "+84900000044",
    email: "quan2@example.com",
    guardianName: "Châu Thị Vy",
    guardianPhone: "+849100044",
    enrollmentDate: "2025-01-07",
    status: "Active",
    riskLevel: "Yellow",
    isNewStudent: false,
  },
  {
    id: "stu-45",
    fullName: "Đinh Thị Trang",
    avatar: "/vietnamese-kid-4-6-girl-10.jpg", // Added HK student avatar, adjusted for age
    dateOfBirth: "2020-05-15", // Updated to 2020
    phoneNumber: "+84900000045",
    email: "thao2@example.com",
    guardianName: "Đinh Văn Trung",
    guardianPhone: "+849100045",
    enrollmentDate: "2025-01-07",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-46",
    fullName: "Kim Văn Sáng",
    avatar: "/vietnamese-kid-4-6-boy-11.jpg", // Added HK student avatar, adjusted for age
    dateOfBirth: "2020-07-22", // Updated to 2020
    phoneNumber: "+84900000046",
    email: "tuan2@example.com",
    guardianName: "Kim Thị Uyên",
    guardianPhone: "+849100046",
    enrollmentDate: "2025-01-07",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-47",
    fullName: "Nguyễn Thị Hà",
    avatar: "/vietnamese-kid-4-6-girl-11.jpg", // Added HK student avatar, adjusted for age
    dateOfBirth: "2020-09-08", // Updated to 2020
    phoneNumber: "+84900000047",
    email: "vy2@example.com",
    guardianName: "Nguyễn Văn Xuân",
    guardianPhone: "+849100047",
    enrollmentDate: "2025-01-07",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-48",
    fullName: "Trần Văn Long",
    avatar: "/vietnamese-kid-4-6-boy-12.jpg", // Added HK student avatar, adjusted for age
    dateOfBirth: "2020-11-25", // Updated to 2020
    phoneNumber: "+84900000048",
    email: "hieu2@example.com",
    guardianName: "Trần Thị Bảo",
    guardianPhone: "+849100048",
    enrollmentDate: "2025-01-07",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },

  // Class 5 students (SKG3p) - Ages 9-10
  {
    id: "stu-49",
    fullName: "Lê Thị Nhi",
    avatar: "/vietnamese-kid-9-10-girl-1.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2015-03-12", // Updated from 2016 to 2015 for SK age range (9-10 years)
    phoneNumber: "+84900000049",
    email: "ha3@example.com",
    guardianName: "Lê Văn Công",
    guardianPhone: "+849100049",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-50",
    fullName: "Phạm Văn Tâm",
    avatar: "/vietnamese-kid-9-10-boy-1.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2015-06-20", // Updated to 2015
    phoneNumber: "+84900000050",
    email: "long3@example.com",
    guardianName: "Phạm Thị Diệp",
    guardianPhone: "+849100050",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-51",
    fullName: "Hoàng Thị Mai",
    avatar: "/vietnamese-kid-9-10-girl-2.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2015-08-17", // Updated to 2015
    phoneNumber: "+84900000051",
    email: "ngoc3@example.com",
    guardianName: "Hoàng Văn Phương",
    guardianPhone: "+849100051",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Yellow",
    isNewStudent: false,
  },
  {
    id: "stu-52",
    fullName: "Vũ Văn Quân",
    avatar: "/vietnamese-kid-9-10-boy-2.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2015-10-05", // Updated to 2015
    phoneNumber: "+84900000052",
    email: "thang3@example.com",
    guardianName: "Vũ Thị Hồng",
    guardianPhone: "+849100052",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-53",
    fullName: "Đặng Thị Thủy",
    avatar: "/vietnamese-kid-9-10-girl-3.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2015-12-28", // Updated to 2015
    phoneNumber: "+84900000053",
    email: "van3@example.com",
    guardianName: "Đặng Văn Tuấn",
    guardianPhone: "+849100053",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-54",
    fullName: "Bùi Văn Hùng",
    avatar: "/vietnamese-kid-9-10-boy-3.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2016-02-14", // Updated to 2016 (8 years old)
    phoneNumber: "+84900000054",
    email: "khoa3@example.com",
    guardianName: "Bùi Thị Lan",
    guardianPhone: "+849100054",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-55",
    fullName: "Phan Thị Diễm",
    avatar: "/vietnamese-kid-9-10-girl-4.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2016-04-30", // Updated to 2016
    phoneNumber: "+84900000055",
    email: "linh3@example.com",
    guardianName: "Phan Văn Nam",
    guardianPhone: "+849100055",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Red",
    isNewStudent: false,
  },
  {
    id: "stu-56",
    fullName: "Trịnh Văn Đức",
    avatar: "/vietnamese-kid-9-10-boy-4.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2016-07-18", // Updated to 2016
    phoneNumber: "+84900000056",
    email: "phuc3@example.com",
    guardianName: "Trịnh Thị Oanh",
    guardianPhone: "+849100056",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-57",
    fullName: "Ngô Thị Thanh",
    avatar: "/vietnamese-kid-9-10-girl-5.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2016-09-03", // Updated to 2016
    phoneNumber: "+84900000057",
    email: "quyen3@example.com",
    guardianName: "Ngô Văn Sơn",
    guardianPhone: "+849100057",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-58",
    fullName: "Lý Văn Tài",
    avatar: "/vietnamese-kid-9-10-boy-5.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2016-11-22", // Updated to 2016
    phoneNumber: "+84900000058",
    email: "anh3@example.com",
    guardianName: "Lý Thị Tuyết",
    guardianPhone: "+849100058",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-59",
    fullName: "Mai Thị Chi",
    avatar: "/vietnamese-kid-9-10-girl-6.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2015-01-09", // Updated to 2015 (10 years old)
    phoneNumber: "+84900000059",
    email: "binh3@example.com",
    guardianName: "Mai Văn Cường",
    guardianPhone: "+849100059",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Green",
    isNewStudent: false,
  },
  {
    id: "stu-60",
    fullName: "Đỗ Văn Công",
    avatar: "/vietnamese-kid-9-10-boy-6.jpg", // Added SK student avatar, adjusted for age
    dateOfBirth: "2015-05-26", // Updated to 2015
    phoneNumber: "+84900000060",
    email: "trang3@example.com",
    guardianName: "Đỗ Thị Dung",
    guardianPhone: "+849100060",
    enrollmentDate: "2025-01-09",
    status: "Active",
    riskLevel: "Yellow",
    isNewStudent: false,
  },

  // Class 7 students (HK4p) - Ages 4-6 (13 students)
  {
    id: "stu-61",
    fullName: "Trần Bảo Châu",
    avatar: "/vietnamese-kid-4-6-girl-1.jpg",
    dateOfBirth: "2020-03-15",
    guardianName: "Trần Văn Long",
    guardianPhone: "+849100061",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-62",
    fullName: "Nguyễn Hoàng Nam",
    avatar: "/vietnamese-kid-4-6-boy-1.jpg",
    dateOfBirth: "2020-05-22",
    guardianName: "Nguyễn Thị Hương",
    guardianPhone: "+849100062",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-63",
    fullName: "Lê Kim Ngân",
    avatar: "/vietnamese-kid-4-6-girl-2.jpg",
    dateOfBirth: "2020-07-10",
    guardianName: "Lê Minh Tuấn",
    guardianPhone: "+849100063",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-64",
    fullName: "Phạm Quốc Bảo",
    avatar: "/vietnamese-kid-4-6-boy-2.jpg",
    dateOfBirth: "2020-09-18",
    guardianName: "Phạm Thị Mai",
    guardianPhone: "+849100064",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-65",
    fullName: "Võ Thanh Tú",
    avatar: "/vietnamese-kid-4-6-girl-3.jpg",
    dateOfBirth: "2020-11-05",
    guardianName: "Võ Văn Phúc",
    guardianPhone: "+849100065",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-66",
    fullName: "Đặng Minh Hiếu",
    avatar: "/vietnamese-kid-4-6-boy-3.jpg",
    dateOfBirth: "2019-12-20",
    guardianName: "Đặng Thị Lan",
    guardianPhone: "+849100066",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-67",
    fullName: "Bùi Thùy Dương",
    avatar: "/vietnamese-kid-4-6-girl-4.jpg",
    dateOfBirth: "2019-08-14",
    guardianName: "Bùi Văn Hải",
    guardianPhone: "+849100067",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-68",
    fullName: "Hoàng Tuấn Kiệt",
    avatar: "/vietnamese-kid-4-6-boy-4.jpg",
    dateOfBirth: "2019-10-30",
    guardianName: "Hoàng Thị Thu",
    guardianPhone: "+849100068",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-69",
    fullName: "Phan Khánh Linh",
    avatar: "/vietnamese-kid-4-6-girl-5.jpg",
    dateOfBirth: "2020-01-08",
    guardianName: "Phan Văn Đức",
    guardianPhone: "+849100069",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-70",
    fullName: "Trịnh Anh Tú",
    avatar: "/vietnamese-kid-4-6-boy-5.jpg",
    dateOfBirth: "2020-04-25",
    guardianName: "Trịnh Thị Hà",
    guardianPhone: "+849100070",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-71",
    fullName: "Ngô Bích Ngọc",
    avatar: "/vietnamese-kid-4-6-girl-6.jpg",
    dateOfBirth: "2020-06-12",
    guardianName: "Ngô Văn Sơn",
    guardianPhone: "+849100071",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-72",
    fullName: "Lý Minh Đức",
    avatar: "/vietnamese-kid-4-6-boy-6.jpg",
    dateOfBirth: "2020-08-19",
    guardianName: "Lý Thị Phương",
    guardianPhone: "+849100072",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-73",
    fullName: "Mai Huyền Trang",
    avatar: "/vietnamese-kid-4-6-girl-1.jpg",
    dateOfBirth: "2019-09-28",
    guardianName: "Mai Văn Thắng",
    guardianPhone: "+849100073",
    enrollmentDate: "2025-01-12",
    status: "Active",
    riskLevel: "Green",
  },

  // Class 8 students (SKG2p) - Ages 6-12 (12 students)
  {
    id: "stu-74",
    fullName: "Đỗ Thị Hồng",
    avatar: "/vietnamese-kid-6-12-girl-1.jpg",
    dateOfBirth: "2017-03-10",
    guardianName: "Đỗ Văn Nam",
    guardianPhone: "+849100074",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-75",
    fullName: "Cao Minh Quân",
    avatar: "/vietnamese-kid-6-12-boy-1.jpg",
    dateOfBirth: "2017-05-18",
    guardianName: "Cao Thị Bình",
    guardianPhone: "+849100075",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-76",
    fullName: "Dương Thu Hà",
    avatar: "/vietnamese-kid-6-12-girl-2.jpg",
    dateOfBirth: "2017-07-22",
    guardianName: "Dương Văn Hùng",
    guardianPhone: "+849100076",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-77",
    fullName: "Hồ Quang Huy",
    avatar: "/vietnamese-kid-6-12-boy-2.jpg",
    dateOfBirth: "2017-09-14",
    guardianName: "Hồ Thị Dung",
    guardianPhone: "+849100077",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-78",
    fullName: "Tô Mỹ Linh",
    avatar: "/vietnamese-kid-6-12-girl-3.jpg",
    dateOfBirth: "2017-11-03",
    guardianName: "Tô Văn Trung",
    guardianPhone: "+849100078",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-79",
    fullName: "Lâm Đức Long",
    avatar: "/vietnamese-kid-6-12-boy-3.jpg",
    dateOfBirth: "2018-01-25",
    guardianName: "Lâm Thị Xuân",
    guardianPhone: "+849100079",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-80",
    fullName: "Vũ Khánh Vy",
    avatar: "/vietnamese-kid-6-12-girl-4.jpg",
    dateOfBirth: "2018-03-12",
    guardianName: "Vũ Văn Tùng",
    guardianPhone: "+849100080",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-81",
    fullName: "Bùi Tuấn Anh",
    avatar: "/vietnamese-kid-6-12-boy-4.jpg",
    dateOfBirth: "2018-05-08",
    guardianName: "Bùi Thị Nga",
    guardianPhone: "+849100081",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-82",
    fullName: "Phan Ngọc Ánh",
    avatar: "/vietnamese-kid-6-12-girl-5.jpg",
    dateOfBirth: "2018-07-20",
    guardianName: "Phan Văn Sơn",
    guardianPhone: "+849100082",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-83",
    fullName: "Trịnh Hoàng Phúc",
    avatar: "/vietnamese-kid-6-12-boy-5.jpg",
    dateOfBirth: "2018-09-15",
    guardianName: "Trịnh Thị Lan",
    guardianPhone: "+849100083",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-84",
    fullName: "Ngô Thanh Tâm",
    avatar: "/vietnamese-kid-6-12-girl-6.jpg",
    dateOfBirth: "2017-12-28",
    guardianName: "Ngô Văn Thành",
    guardianPhone: "+849100084",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-85",
    fullName: "Lý Quốc Thắng",
    avatar: "/vietnamese-kid-6-12-boy-6.jpg",
    dateOfBirth: "2017-04-16",
    guardianName: "Lý Thị Mai",
    guardianPhone: "+849100085",
    enrollmentDate: "2025-01-14",
    status: "Active",
    riskLevel: "Green",
  },

  // Class 9 students (YLA1) - Ages 11-15 (12 students)
  {
    id: "stu-86",
    fullName: "Mai Khánh Huyền",
    avatar: "/vietnamese-teen-girl-1.jpg",
    dateOfBirth: "2013-02-14",
    guardianName: "Mai Văn Đạt",
    guardianPhone: "+849100086",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-87",
    fullName: "Đỗ Quang Minh",
    avatar: "/vietnamese-teen-boy-1.jpg",
    dateOfBirth: "2013-04-20",
    guardianName: "Đỗ Thị Hoa",
    guardianPhone: "+849100087",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-88",
    fullName: "Võ Thùy Dung",
    avatar: "/vietnamese-teen-girl-2.jpg",
    dateOfBirth: "2013-06-08",
    guardianName: "Võ Văn Khải",
    guardianPhone: "+849100088",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-89",
    fullName: "Cao Đức Thành",
    avatar: "/vietnamese-teen-boy-2.jpg",
    dateOfBirth: "2013-08-25",
    guardianName: "Cao Thị Liên",
    guardianPhone: "+849100089",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-90",
    fullName: "Dương Ngọc Hân",
    avatar: "/vietnamese-teen-girl-3.jpg",
    dateOfBirth: "2013-10-12",
    guardianName: "Dương Văn Tài",
    guardianPhone: "+849100090",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-91",
    fullName: "Hồ Minh Tân",
    avatar: "/vietnamese-teen-boy-3.jpg",
    dateOfBirth: "2013-12-03",
    guardianName: "Hồ Thị Kim",
    guardianPhone: "+849100091",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-92",
    fullName: "Tô Bảo Trâm",
    avatar: "/vietnamese-teen-girl-4.jpg",
    dateOfBirth: "2014-01-18",
    guardianName: "Tô Văn Hùng",
    guardianPhone: "+849100092",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-93",
    fullName: "Lâm Tuấn Hưng",
    avatar: "/vietnamese-teen-boy-4.jpg",
    dateOfBirth: "2014-03-22",
    guardianName: "Lâm Thị Hồng",
    guardianPhone: "+849100093",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-94",
    fullName: "Vũ Phương Anh",
    avatar: "/vietnamese-teen-girl-5.jpg",
    dateOfBirth: "2014-05-10",
    guardianName: "Vũ Văn Nam",
    guardianPhone: "+849100094",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-95",
    fullName: "Bùi Hoàng Long",
    avatar: "/vietnamese-teen-boy-5.jpg",
    dateOfBirth: "2014-07-05",
    guardianName: "Bùi Thị Thảo",
    guardianPhone: "+849100095",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-96",
    fullName: "Phan Thu Thảo",
    avatar: "/vietnamese-teen-girl-1.jpg",
    dateOfBirth: "2013-09-19",
    guardianName: "Phan Văn Đông",
    guardianPhone: "+849100096",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-97",
    fullName: "Trịnh Quốc Anh",
    avatar: "/vietnamese-teen-boy-1.jpg",
    dateOfBirth: "2013-11-27",
    guardianName: "Trịnh Thị Dung",
    guardianPhone: "+849100097",
    enrollmentDate: "2025-01-11",
    status: "Active",
    riskLevel: "Green",
  },

  // Class 10 students (HK6p) - Ages 4-6 (13 students)
  {
    id: "stu-98",
    fullName: "Ngô Minh Châu",
    avatar: "/vietnamese-kid-4-6-girl-2.jpg",
    dateOfBirth: "2020-02-11",
    guardianName: "Ngô Văn Tuấn",
    guardianPhone: "+849100098",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-99",
    fullName: "Lý Hoàng Khoa",
    avatar: "/vietnamese-kid-4-6-boy-2.jpg",
    dateOfBirth: "2020-04-19",
    guardianName: "Lý Thị Vân",
    guardianPhone: "+849100099",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-100",
    fullName: "Mai Thanh Thảo",
    avatar: "/vietnamese-kid-4-6-girl-3.jpg",
    dateOfBirth: "2020-06-27",
    guardianName: "Mai Văn Phúc",
    guardianPhone: "+849100100",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-101",
    fullName: "Đỗ Anh Khôi",
    avatar: "/vietnamese-kid-4-6-boy-3.jpg",
    dateOfBirth: "2020-08-14",
    guardianName: "Đỗ Thị Thu",
    guardianPhone: "+849100101",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-102",
    fullName: "Võ Khánh Ngân",
    avatar: "/vietnamese-kid-4-6-girl-4.jpg",
    dateOfBirth: "2020-10-05",
    guardianName: "Võ Văn Hải",
    guardianPhone: "+849100102",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-103",
    fullName: "Cao Bảo Nam",
    avatar: "/vietnamese-kid-4-6-boy-4.jpg",
    dateOfBirth: "2019-12-23",
    guardianName: "Cao Thị Lan",
    guardianPhone: "+849100103",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-104",
    fullName: "Dương Hà My",
    avatar: "/vietnamese-kid-4-6-girl-5.jpg",
    dateOfBirth: "2019-10-18",
    guardianName: "Dương Văn Thành",
    guardianPhone: "+849100104",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-105",
    fullName: "Hồ Quang Dũng",
    avatar: "/vietnamese-kid-4-6-boy-5.jpg",
    dateOfBirth: "2019-09-09",
    guardianName: "Hồ Thị Hương",
    guardianPhone: "+849100105",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-106",
    fullName: "Tô Bích Phương",
    avatar: "/vietnamese-kid-4-6-girl-6.jpg",
    dateOfBirth: "2019-11-15",
    guardianName: "Tô Văn Long",
    guardianPhone: "+849100106",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-107",
    fullName: "Lâm Minh Tâm",
    avatar: "/vietnamese-kid-4-6-boy-6.jpg",
    dateOfBirth: "2020-01-21",
    guardianName: "Lâm Thị Nga",
    guardianPhone: "+849100107",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-108",
    fullName: "Vũ Thanh Huyền",
    avatar: "/vietnamese-kid-4-6-girl-1.jpg",
    dateOfBirth: "2020-03-08",
    guardianName: "Vũ Văn Đức",
    guardianPhone: "+849100108",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-109",
    fullName: "Bùi Quốc Khánh",
    avatar: "/vietnamese-kid-4-6-boy-1.jpg",
    dateOfBirth: "2020-05-16",
    guardianName: "Bùi Thị Mai",
    guardianPhone: "+849100109",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-110",
    fullName: "Phan Ngọc Hân",
    avatar: "/vietnamese-kid-4-6-girl-2.jpg",
    dateOfBirth: "2020-07-24",
    guardianName: "Phan Văn Tùng",
    guardianPhone: "+849100110",
    enrollmentDate: "2025-01-13",
    status: "Active",
    riskLevel: "Green",
  },

  // Class 11 students (SKG1s) - Ages 6-12 (12 students)
  {
    id: "stu-111",
    fullName: "Trịnh Bảo Châu",
    avatar: "/vietnamese-kid-6-12-girl-1.jpg",
    dateOfBirth: "2018-02-07",
    guardianName: "Trịnh Văn Thắng",
    guardianPhone: "+849100111",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-112",
    fullName: "Ngô Tuấn Hưng",
    avatar: "/vietnamese-kid-6-12-boy-1.jpg",
    dateOfBirth: "2018-04-14",
    guardianName: "Ngô Thị Hồng",
    guardianPhone: "+849100112",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-113",
    fullName: "Lý Khánh Linh",
    avatar: "/vietnamese-kid-6-12-girl-2.jpg",
    dateOfBirth: "2018-06-22",
    guardianName: "Lý Văn Nam",
    guardianPhone: "+849100113",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-114",
    fullName: "Mai Hoàng Phúc",
    avatar: "/vietnamese-kid-6-12-boy-2.jpg",
    dateOfBirth: "2018-08-30",
    guardianName: "Mai Thị Bình",
    guardianPhone: "+849100114",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-115",
    fullName: "Đỗ Mỹ Duyên",
    avatar: "/vietnamese-kid-6-12-girl-3.jpg",
    dateOfBirth: "2017-10-16",
    guardianName: "Đỗ Văn Sơn",
    guardianPhone: "+849100115",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-116",
    fullName: "Võ Quang Hải",
    avatar: "/vietnamese-kid-6-12-boy-3.jpg",
    dateOfBirth: "2017-12-04",
    guardianName: "Võ Thị Lan",
    guardianPhone: "+849100116",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-117",
    fullName: "Cao Thanh Trúc",
    avatar: "/vietnamese-kid-6-12-girl-4.jpg",
    dateOfBirth: "2018-01-19",
    guardianName: "Cao Văn Đạt",
    guardianPhone: "+849100117",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-118",
    fullName: "Dương Anh Tuấn",
    avatar: "/vietnamese-kid-6-12-boy-4.jpg",
    dateOfBirth: "2018-03-27",
    guardianName: "Dương Thị Hoa",
    guardianPhone: "+849100118",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-119",
    fullName: "Hồ Mỹ Linh",
    avatar: "/vietnamese-kid-6-12-girl-5.jpg",
    dateOfBirth: "2018-05-13",
    guardianName: "Hồ Văn Khoa",
    guardianPhone: "+849100119",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-120",
    fullName: "Tô Minh Thành",
    avatar: "/vietnamese-kid-6-12-boy-5.jpg",
    dateOfBirth: "2018-07-21",
    guardianName: "Tô Thị Thu",
    guardianPhone: "+849100120",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-121",
    fullName: "Lâm Hồng Nhung",
    avatar: "/vietnamese-kid-6-12-girl-6.jpg",
    dateOfBirth: "2018-09-08",
    guardianName: "Lâm Văn Hùng",
    guardianPhone: "+849100121",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-122",
    fullName: "Vũ Đức Anh",
    avatar: "/vietnamese-kid-6-12-boy-6.jpg",
    dateOfBirth: "2017-11-25",
    guardianName: "Vũ Thị Liên",
    guardianPhone: "+849100122",
    enrollmentDate: "2025-01-15",
    status: "Active",
    riskLevel: "Green",
  },

  // Class 12 students (YLC2) - Ages 11-15 (13 students)
  {
    id: "stu-123",
    fullName: "Bùi Phương Thảo",
    avatar: "/vietnamese-teen-girl-2.jpg",
    dateOfBirth: "2012-01-09",
    guardianName: "Bùi Văn Tú",
    guardianPhone: "+849100123",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-124",
    fullName: "Phan Quốc Bảo",
    avatar: "/vietnamese-teen-boy-2.jpg",
    dateOfBirth: "2012-03-17",
    guardianName: "Phan Thị Hồng",
    guardianPhone: "+849100124",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-125",
    fullName: "Trịnh Khánh My",
    avatar: "/vietnamese-teen-girl-3.jpg",
    dateOfBirth: "2012-05-24",
    guardianName: "Trịnh Văn Sơn",
    guardianPhone: "+849100125",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-126",
    fullName: "Ngô Hoàng Anh",
    avatar: "/vietnamese-teen-boy-3.jpg",
    dateOfBirth: "2012-07-11",
    guardianName: "Ngô Thị Kim",
    guardianPhone: "+849100126",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-127",
    fullName: "Lý Thanh Hương",
    avatar: "/vietnamese-teen-girl-4.jpg",
    dateOfBirth: "2012-09-18",
    guardianName: "Lý Văn Thành",
    guardianPhone: "+849100127",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-128",
    fullName: "Mai Tuấn Kiệt",
    avatar: "/vietnamese-teen-boy-4.jpg",
    dateOfBirth: "2012-11-05",
    guardianName: "Mai Thị Nga",
    guardianPhone: "+849100128",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-129",
    fullName: "Đỗ Bích Thảo",
    avatar: "/vietnamese-teen-girl-5.jpg",
    dateOfBirth: "2013-01-22",
    guardianName: "Đỗ Văn Long",
    guardianPhone: "+849100129",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-130",
    fullName: "Võ Minh Nhật",
    avatar: "/vietnamese-teen-boy-5.jpg",
    dateOfBirth: "2013-03-10",
    guardianName: "Võ Thị Hoa",
    guardianPhone: "+849100130",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-131",
    fullName: "Cao Ngọc Anh",
    avatar: "/vietnamese-teen-girl-1.jpg",
    dateOfBirth: "2013-05-18",
    guardianName: "Cao Văn Hải",
    guardianPhone: "+849100131",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-132",
    fullName: "Dương Quang Huy",
    avatar: "/vietnamese-teen-boy-1.jpg",
    dateOfBirth: "2013-07-25",
    guardianName: "Dương Thị Lan",
    guardianPhone: "+849100132",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-133",
    fullName: "Hồ Thu Trang",
    avatar: "/vietnamese-teen-girl-2.jpg",
    dateOfBirth: "2013-09-12",
    guardianName: "Hồ Văn Phúc",
    guardianPhone: "+849100133",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-134",
    fullName: "Tô Đức Thắng",
    avatar: "/vietnamese-teen-boy-2.jpg",
    dateOfBirth: "2013-11-08",
    guardianName: "Tô Thị Mai",
    guardianPhone: "+849100134",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-135",
    fullName: "Lâm Khánh Vy",
    avatar: "/vietnamese-teen-girl-3.jpg",
    dateOfBirth: "2012-12-20",
    guardianName: "Lâm Văn Tùng",
    guardianPhone: "+849100135",
    enrollmentDate: "2025-01-16",
    status: "Active",
    riskLevel: "Green",
  },

  // Class 13 students (HK4p) - Ages 4-6 (12 students)
  {
    id: "stu-136",
    fullName: "Vũ Bảo Ngọc",
    avatar: "/vietnamese-kid-4-6-girl-3.jpg",
    dateOfBirth: "2020-09-11",
    guardianName: "Vũ Văn Nam",
    guardianPhone: "+849100136",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-137",
    fullName: "Bùi Quang Minh",
    avatar: "/vietnamese-kid-4-6-boy-3.jpg",
    dateOfBirth: "2019-11-18",
    guardianName: "Bùi Thị Thảo",
    guardianPhone: "+849100137",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-138",
    fullName: "Phan Hà My",
    avatar: "/vietnamese-kid-4-6-girl-4.jpg",
    dateOfBirth: "2020-01-25",
    guardianName: "Phan Văn Hùng",
    guardianPhone: "+849100138",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-139",
    fullName: "Trịnh Anh Khoa",
    avatar: "/vietnamese-kid-4-6-boy-4.jpg",
    dateOfBirth: "2020-03-14",
    guardianName: "Trịnh Thị Lan",
    guardianPhone: "+849100139",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-140",
    fullName: "Ngô Thanh Nhàn",
    avatar: "/vietnamese-kid-4-6-girl-5.jpg",
    dateOfBirth: "2020-05-22",
    guardianName: "Ngô Văn Đức",
    guardianPhone: "+849100140",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-141",
    fullName: "Lý Hoàng Long",
    avatar: "/vietnamese-kid-4-6-boy-5.jpg",
    dateOfBirth: "2020-07-09",
    guardianName: "Lý Thị Hồng",
    guardianPhone: "+849100141",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-142",
    fullName: "Mai Ngọc Diệp",
    avatar: "/vietnamese-kid-4-6-girl-6.jpg",
    dateOfBirth: "2020-09-16",
    guardianName: "Mai Văn Sơn",
    guardianPhone: "+849100142",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-143",
    fullName: "Đỗ Minh Tâm",
    avatar: "/vietnamese-kid-4-6-boy-6.jpg",
    dateOfBirth: "2020-11-03",
    guardianName: "Đỗ Thị Bình",
    guardianPhone: "+849100143",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-144",
    fullName: "Võ Khánh Chi",
    avatar: "/vietnamese-kid-4-6-girl-1.jpg",
    dateOfBirth: "2019-12-20",
    guardianName: "Võ Văn Phúc",
    guardianPhone: "+849100144",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-145",
    fullName: "Cao Tuấn Đạt",
    avatar: "/vietnamese-kid-4-6-boy-1.jpg",
    dateOfBirth: "2019-10-08",
    guardianName: "Cao Thị Mai",
    guardianPhone: "+849100145",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-146",
    fullName: "Dương Phương Anh",
    avatar: "/vietnamese-kid-4-6-girl-2.jpg",
    dateOfBirth: "2019-08-15",
    guardianName: "Dương Văn Khoa",
    guardianPhone: "+849100146",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-147",
    fullName: "Hồ Quang Vinh",
    avatar: "/vietnamese-kid-4-6-boy-2.jpg",
    dateOfBirth: "2019-09-22",
    guardianName: "Hồ Thị Thu",
    guardianPhone: "+849100147",
    enrollmentDate: "2025-01-17",
    status: "Active",
    riskLevel: "Green",
  },

  // Class 14 students (SKG3p) - Ages 6-12 (13 students)
  {
    id: "stu-148",
    fullName: "Tô Hồng Nhung",
    avatar: "/vietnamese-kid-6-12-girl-2.jpg",
    dateOfBirth: "2016-02-14",
    guardianName: "Tô Văn Hải",
    guardianPhone: "+849100148",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-149",
    fullName: "Lâm Quốc Huy",
    avatar: "/vietnamese-kid-6-12-boy-2.jpg",
    dateOfBirth: "2016-04-22",
    guardianName: "Lâm Thị Lan",
    guardianPhone: "+849100149",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-150",
    fullName: "Vũ Thanh Trúc",
    avatar: "/vietnamese-kid-6-12-girl-3.jpg",
    dateOfBirth: "2016-06-10",
    guardianName: "Vũ Văn Long",
    guardianPhone: "+849100150",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-151",
    fullName: "Bùi Anh Khoa",
    avatar: "/vietnamese-kid-6-12-boy-3.jpg",
    dateOfBirth: "2016-08-18",
    guardianName: "Bùi Thị Nga",
    guardianPhone: "+849100151",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-152",
    fullName: "Phan Mỹ Duyên",
    avatar: "/vietnamese-kid-6-12-girl-4.jpg",
    dateOfBirth: "2016-10-05",
    guardianName: "Phan Văn Tùng",
    guardianPhone: "+849100152",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-153",
    fullName: "Trịnh Hoàng Nam",
    avatar: "/vietnamese-kid-6-12-boy-4.jpg",
    dateOfBirth: "2016-12-22",
    guardianName: "Trịnh Thị Hoa",
    guardianPhone: "+849100153",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-154",
    fullName: "Ngô Bảo Trân",
    avatar: "/vietnamese-kid-6-12-girl-5.jpg",
    dateOfBirth: "2017-02-09",
    guardianName: "Ngô Văn Đạt",
    guardianPhone: "+849100154",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-155",
    fullName: "Lý Tuấn Hùng",
    avatar: "/vietnamese-kid-6-12-boy-5.jpg",
    dateOfBirth: "2017-04-17",
    guardianName: "Lý Thị Mai",
    guardianPhone: "+849100155",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-156",
    fullName: "Mai Phương Linh",
    avatar: "/vietnamese-kid-6-12-girl-6.jpg",
    dateOfBirth: "2017-06-24",
    guardianName: "Mai Văn Thành",
    guardianPhone: "+849100156",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-157",
    fullName: "Đỗ Quang Thắng",
    avatar: "/vietnamese-kid-6-12-boy-6.jpg",
    dateOfBirth: "2017-08-11",
    guardianName: "Đỗ Thị Thu",
    guardianPhone: "+849100157",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-158",
    fullName: "Võ Ngọc Hân",
    avatar: "/vietnamese-kid-6-12-girl-1.jpg",
    dateOfBirth: "2017-10-28",
    guardianName: "Võ Văn Khải",
    guardianPhone: "+849100158",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-159",
    fullName: "Cao Minh Đức",
    avatar: "/vietnamese-kid-6-12-boy-1.jpg",
    dateOfBirth: "2017-12-15",
    guardianName: "Cao Thị Liên",
    guardianPhone: "+849100159",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-160",
    fullName: "Dương Thanh Tú",
    avatar: "/vietnamese-kid-6-12-girl-2.jpg",
    dateOfBirth: "2016-03-03",
    guardianName: "Dương Văn Sơn",
    guardianPhone: "+849100160",
    enrollmentDate: "2025-01-18",
    status: "Active",
    riskLevel: "Green",
  },

  // Class 15 students (YLB1) - Ages 11-15 (12 students)
  {
    id: "stu-161",
    fullName: "Hồ Minh Hằng",
    avatar: "/vietnamese-teen-girl-4.jpg",
    dateOfBirth: "2011-01-20",
    guardianName: "Hồ Văn Tuấn",
    guardianPhone: "+849100161",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Red",
  },
  {
    id: "stu-162",
    fullName: "Tô Quốc Anh",
    avatar: "/vietnamese-teen-boy-4.jpg",
    dateOfBirth: "2011-03-28",
    guardianName: "Tô Thị Hồng",
    guardianPhone: "+849100162",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-163",
    fullName: "Lâm Khánh Huyền",
    avatar: "/vietnamese-teen-girl-5.jpg",
    dateOfBirth: "2011-05-15",
    guardianName: "Lâm Văn Nam",
    guardianPhone: "+849100163",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-164",
    fullName: "Vũ Hoàng Khang",
    avatar: "/vietnamese-teen-boy-5.jpg",
    dateOfBirth: "2011-07-22",
    guardianName: "Vũ Thị Nga",
    guardianPhone: "+849100164",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-165",
    fullName: "Bùi Ngọc Mai",
    avatar: "/vietnamese-teen-girl-1.jpg",
    dateOfBirth: "2011-09-09",
    guardianName: "Bùi Văn Đức",
    guardianPhone: "+849100165",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-166",
    fullName: "Phan Tuấn Minh",
    avatar: "/vietnamese-teen-boy-1.jpg",
    dateOfBirth: "2011-11-16",
    guardianName: "Phan Thị Lan",
    guardianPhone: "+849100166",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-167",
    fullName: "Trịnh Bảo Châu",
    avatar: "/vietnamese-teen-girl-2.jpg",
    dateOfBirth: "2012-01-03",
    guardianName: "Trịnh Văn Khoa",
    guardianPhone: "+849100167",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Red",
  },
  {
    id: "stu-168",
    fullName: "Ngô Đức Huy",
    avatar: "/vietnamese-teen-boy-2.jpg",
    dateOfBirth: "2012-03-11",
    guardianName: "Ngô Thị Kim",
    guardianPhone: "+849100168",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-169",
    fullName: "Lý Phương Thảo",
    avatar: "/vietnamese-teen-girl-3.jpg",
    dateOfBirth: "2012-05-18",
    guardianName: "Lý Văn Thành",
    guardianPhone: "+849100169",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-170",
    fullName: "Mai Quang Long",
    avatar: "/vietnamese-teen-boy-3.jpg",
    dateOfBirth: "2012-07-25",
    guardianName: "Mai Thị Hoa",
    guardianPhone: "+849100170",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-171",
    fullName: "Đỗ Thu Hà",
    avatar: "/vietnamese-teen-girl-4.jpg",
    dateOfBirth: "2012-09-12",
    guardianName: "Đỗ Văn Hải",
    guardianPhone: "+849100171",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-172",
    fullName: "Võ Minh Tú",
    avatar: "/vietnamese-teen-boy-4.jpg",
    dateOfBirth: "2012-11-08",
    guardianName: "Võ Thị Liên",
    guardianPhone: "+849100172",
    enrollmentDate: "2025-01-19",
    status: "Active",
    riskLevel: "Yellow",
  },

  // Class 16 students (SKG2p) - Ages 6-12 (13 students)
  {
    id: "stu-173",
    fullName: "Cao Bảo Anh",
    avatar: "/vietnamese-kid-6-12-girl-3.jpg",
    dateOfBirth: "2016-01-10",
    guardianName: "Cao Văn Phúc",
    guardianPhone: "+849100173",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-174",
    fullName: "Dương Hoàng Khôi",
    avatar: "/vietnamese-kid-6-12-boy-3.jpg",
    dateOfBirth: "2016-03-18",
    guardianName: "Dương Thị Mai",
    guardianPhone: "+849100174",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-175",
    fullName: "Hồ Mỹ Linh",
    avatar: "/vietnamese-kid-6-12-girl-4.jpg",
    dateOfBirth: "2016-05-25",
    guardianName: "Hồ Văn Long",
    guardianPhone: "+849100175",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-176",
    fullName: "Tô Quang Dũng",
    avatar: "/vietnamese-kid-6-12-boy-4.jpg",
    dateOfBirth: "2016-07-12",
    guardianName: "Tô Thị Hương",
    guardianPhone: "+849100176",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-177",
    fullName: "Lâm Ngọc Hân",
    avatar: "/vietnamese-kid-6-12-girl-5.jpg",
    dateOfBirth: "2016-09-19",
    guardianName: "Lâm Văn Đạt",
    guardianPhone: "+849100177",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-178",
    fullName: "Vũ Tuấn Anh",
    avatar: "/vietnamese-kid-6-12-boy-5.jpg",
    dateOfBirth: "2016-11-06",
    guardianName: "Vũ Thị Thu",
    guardianPhone: "+849100178",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-179",
    fullName: "Bùi Thanh Thảo",
    avatar: "/vietnamese-kid-6-12-girl-6.jpg",
    dateOfBirth: "2017-01-23",
    guardianName: "Bùi Văn Sơn",
    guardianPhone: "+849100179",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-180",
    fullName: "Phan Minh Khang",
    avatar: "/vietnamese-kid-6-12-boy-6.jpg",
    dateOfBirth: "2017-03-10",
    guardianName: "Phan Thị Lan",
    guardianPhone: "+849100180",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Yellow",
  },
  {
    id: "stu-181",
    fullName: "Trịnh Khánh Linh",
    avatar: "/vietnamese-kid-6-12-girl-1.jpg",
    dateOfBirth: "2017-05-17",
    guardianName: "Trịnh Văn Khoa",
    guardianPhone: "+849100181",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-182",
    fullName: "Ngô Hoàng Phúc",
    avatar: "/vietnamese-kid-6-12-boy-1.jpg",
    dateOfBirth: "2017-07-24",
    guardianName: "Ngô Thị Hồng",
    guardianPhone: "+849100182",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-183",
    fullName: "Lý Bảo Ngọc",
    avatar: "/vietnamese-kid-6-12-girl-2.jpg",
    dateOfBirth: "2017-09-11",
    guardianName: "Lý Văn Nam",
    guardianPhone: "+849100183",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-184",
    fullName: "Mai Quốc Khánh",
    avatar: "/vietnamese-kid-6-12-boy-2.jpg",
    dateOfBirth: "2017-11-28",
    guardianName: "Mai Thị Bình",
    guardianPhone: "+849100184",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
  {
    id: "stu-185",
    fullName: "Đỗ Phương Anh",
    avatar: "/vietnamese-kid-6-12-girl-3.jpg",
    dateOfBirth: "2016-02-05",
    guardianName: "Đỗ Văn Hùng",
    guardianPhone: "+849100185",
    enrollmentDate: "2025-01-20",
    status: "Active",
    riskLevel: "Green",
  },
]

// Enrollments - distribute students across classes
export const mockEnrollments: Enrollment[] = [
  // Class 1 (12 students)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `enr-1-${i + 1}`,
    studentId: `stu-${i + 1}`,
    classId: "cls-1",
    enrolledDate: "2025-01-06",
    status: "Active" as const,
  })),
  // Class 2 (15 students)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `enr-2-${i + 1}`,
    studentId: `stu-${13 + i}`,
    classId: "cls-2",
    enrolledDate: "2025-01-08",
    status: "Active" as const,
  })),
  // Class 3 (10 students)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `enr-3-${i + 1}`,
    studentId: `stu-${28 + i}`,
    classId: "cls-3",
    enrolledDate: "2025-01-10",
    status: "Active" as const,
  })),
  // Class 4 (8 students)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `enr-4-${i + 1}`,
    studentId: `stu-${38 + i}`,
    classId: "cls-4",
    enrolledDate: "2025-01-07",
    status: "Active" as const,
  })),
  // Class 5 (13 students)
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `enr-5-${i + 1}`,
    studentId: `stu-${46 + i}`,
    classId: "cls-5",
    enrolledDate: "2025-01-09",
    status: "Active" as const,
  })),
  // Class 7 (13 students)
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `enr-7-${i + 1}`,
    studentId: `stu-${61 + i}`,
    classId: "cls-7",
    enrolledDate: "2025-01-12",
    status: "Active" as const,
  })),
  // Class 8 (12 students)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `enr-8-${i + 1}`,
    studentId: `stu-${74 + i}`,
    classId: "cls-8",
    enrolledDate: "2025-01-14",
    status: "Active" as const,
  })),
  // Class 9 (12 students)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `enr-9-${i + 1}`,
    studentId: `stu-${86 + i}`,
    classId: "cls-9",
    enrolledDate: "2025-01-11",
    status: "Active" as const,
  })),
  // Class 10 (13 students)
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `enr-10-${i + 1}`,
    studentId: `stu-${98 + i}`,
    classId: "cls-10",
    enrolledDate: "2025-01-13",
    status: "Active" as const,
  })),
  // Class 11 (12 students)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `enr-11-${i + 1}`,
    studentId: `stu-${111 + i}`,
    classId: "cls-11",
    enrolledDate: "2025-01-15",
    status: "Active" as const,
  })),
  // Class 12 (13 students)
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `enr-12-${i + 1}`,
    studentId: `stu-${123 + i}`,
    classId: "cls-12",
    enrolledDate: "2025-01-16",
    status: "Active" as const,
  })),
  // Class 13 (12 students)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `enr-13-${i + 1}`,
    studentId: `stu-${136 + i}`,
    classId: "cls-13",
    enrolledDate: "2025-01-17",
    status: "Active" as const,
  })),
  // Class 14 (13 students)
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `enr-14-${i + 1}`,
    studentId: `stu-${148 + i}`,
    classId: "cls-14",
    enrolledDate: "2025-01-18",
    status: "Active" as const,
  })),
  // Class 15 (12 students)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `enr-15-${i + 1}`,
    studentId: `stu-${161 + i}`,
    classId: "cls-15",
    enrolledDate: "2025-01-19",
    status: "Active" as const,
  })),
  // Class 16 (13 students)
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `enr-16-${i + 1}`,
    studentId: `stu-${173 + i}`,
    classId: "cls-16",
    enrolledDate: "2025-01-20",
    status: "Active" as const,
  })),
]

// Sample attendance for completed sessions
export const mockAttendance: Attendance[] = []

// Populate attendance for ses-1
for (let i = 1; i <= 12; i++) {
  mockAttendance.push({
    id: `att-1-${i}`,
    sessionId: "ses-1",
    studentId: `stu-${i}`,
    status: i % 8 === 0 ? "Absent" : i % 7 === 0 ? "Late" : "Present",
    reason: i % 8 === 0 ? "Sick" : i % 7 === 0 ? "Traffic" : undefined,
  })
}

// Student Notes
export const mockStudentNotes: StudentNote[] = [
  {
    id: "note-1",
    sessionId: "ses-1",
    studentId: "stu-1",
    noteType: "Positive",
    frequency: "Daily",
    content: "Excellent participation in class discussions",
    tags: ["Engagement", "Speaking"],
    createdBy: "usr-ta-1",
    createdAt: "2025-01-06T10:05:00Z",
  },
  {
    id: "note-2",
    sessionId: "ses-1",
    studentId: "stu-3",
    noteType: "NeedsImprovement",
    frequency: "Daily",
    content: "Struggled with grammar exercises, needs extra practice",
    parentSupportSuggestion:
      "Please review grammar rules at home using workbook pages 10-15. Practice 15 minutes daily.",
    tags: ["Grammar", "WrittenWork"],
    createdBy: "usr-ta-1",
    createdAt: "2025-01-06T10:10:00Z",
  },
  {
    id: "note-3",
    sessionId: "ses-1",
    studentId: "stu-5",
    noteType: "SBI",
    frequency: "Periodic",
    content:
      "Situation: During group activity. Behavior: Took initiative to lead team. Impact: Helped group complete task successfully.",
    tags: ["Leadership", "Teamwork"],
    createdBy: "usr-teacher-1",
    createdAt: "2025-01-06T10:15:00Z",
  },
  {
    id: "note-4",
    sessionId: "ses-2",
    studentId: "stu-2",
    noteType: "Positive",
    frequency: "Daily",
    content: "Great improvement in pronunciation",
    tags: ["Speaking", "Improvement"],
    createdBy: "usr-ta-1",
    createdAt: "2025-01-13T10:05:00Z",
  },
  {
    id: "note-5",
    sessionId: "ses-2",
    studentId: "stu-8",
    noteType: "NeedsImprovement",
    frequency: "Daily",
    content: "Multiple absences affecting progress",
    parentSupportSuggestion:
      "Please ensure student attends all sessions. Contact Student Care if there are ongoing issues.",
    tags: ["Attendance", "Progress"],
    createdBy: "usr-teacher-1",
    createdAt: "2025-01-13T10:20:00Z",
  },
]

// Default checklist items
export const defaultChecklistItems: ChecklistItem[] = [
  {
    id: "chk-1",
    label: "Attendance taken",
    labelVN: "Điểm danh",
    checked: false,
    required: true,
  },
  {
    id: "chk-2",
    label: "Learning materials distributed",
    labelVN: "Phát tài liệu học tập",
    checked: false,
    required: true,
  },
  {
    id: "chk-3",
    label: "Homework collected and checked",
    labelVN: "Thu và kiểm tra bài tập về nhà",
    checked: false,
    required: true,
  },
  {
    id: "chk-4",
    label: "Classroom cleaned and organized",
    labelVN: "Dọn dẹp và sắp xếp lớp học",
    checked: false,
    required: true,
  },
  {
    id: "chk-5",
    label: "Equipment checked and working",
    labelVN: "Kiểm tra thiết bị hoạt động",
    checked: false,
    required: true,
  },
  {
    id: "chk-6",
    label: "Student folders updated",
    labelVN: "Cập nhật hồ sơ học viên",
    checked: false,
    required: false,
  },
]

// Class Reports
export const mockClassReports: ClassReport[] = [
  {
    id: "rpt-1",
    sessionId: "ses-1",
    summary: "Good first session with high energy. Students actively participated in ice-breaking activities.",
    progressUpdate: "Covered unit 1 introduction. All students comfortable with basic grammar review.",
    areasForImprovement: "Need to work on time management for group activities.",
    nextActions: "Prepare more structured group work for next session. Follow up with Student 3 on grammar.",
    homeAssignment: "Workbook pages 10-15, vocabulary exercises 1-3",
    status: "Approved",
    checklistItems: defaultChecklistItems.map((item) => ({ ...item, checked: true })),
    submittedBy: "usr-ta-1",
    submittedAt: "2025-01-06T10:30:00Z",
    approvedBy: "usr-teacher-1",
    approvedAt: "2025-01-06T11:00:00Z",
  },
  {
    id: "rpt-2",
    sessionId: "ses-2",
    summary: "Session focused on Present Perfect tense. Students showed good understanding of concept.",
    progressUpdate: "Completed unit 2 grammar exercises. 80% of students passed quick assessment.",
    areasForImprovement: "Some students still confuse Present Perfect with Past Simple.",
    nextActions: "Plan additional practice exercises. Create comparison chart for next session.",
    homeAssignment: "Grammar worksheet on tenses, prepare short presentation",
    status: "Submitted",
    checklistItems: defaultChecklistItems.map((item) => ({ ...item, checked: true })),
    submittedBy: "usr-ta-1",
    submittedAt: "2025-01-13T10:35:00Z",
  },
]

// Special Requests
export const mockSpecialRequests: SpecialRequest[] = [
  {
    id: "req-1",
    classId: "cls-1",
    studentId: "stu-3",
    type: "Academic Support",
    title: "Extra grammar tutoring needed",
    description: "Student struggling with intermediate grammar concepts. Recommend 1-on-1 support sessions.",
    priority: "Medium",
    status: "Open",
    requestedBy: "usr-ta-1",
    requestedAt: "2025-01-06T10:30:00Z",
    dueDate: "2025-01-20",
    slaStatus: "OnTrack",
  },
  {
    id: "req-2",
    classId: "cls-2",
    type: "Facility Issue",
    title: "Projector not working",
    description: "Classroom B projector needs repair or replacement.",
    priority: "High",
    status: "InProgress",
    requestedBy: "usr-ta-2",
    requestedAt: "2025-01-08T14:05:00Z",
    assignedTo: "Facilities Team",
    dueDate: "2025-01-10",
    slaStatus: "AtRisk",
  },
  {
    id: "req-3",
    classId: "cls-4",
    studentId: "stu-40",
    type: "Behavioral Concern",
    title: "Student disengagement",
    description: "Student frequently distracted and not participating. May need counseling support.",
    priority: "Urgent",
    status: "Open",
    requestedBy: "usr-teacher-1",
    requestedAt: "2025-01-07T09:00:00Z",
    dueDate: "2025-01-09",
    slaStatus: "Overdue",
  },
  {
    id: "req-4",
    classId: "cls-1",
    type: "Material Request",
    title: "Additional workbooks needed",
    description: "Class size increased, need 3 more workbooks.",
    priority: "Low",
    status: "Resolved",
    requestedBy: "usr-teacher-1",
    requestedAt: "2025-01-05T08:00:00Z",
    resolvedAt: "2025-01-06T16:00:00Z",
    resolution: "Workbooks delivered to classroom.",
    slaStatus: "OnTrack",
  },
  {
    id: "req-5",
    classId: "cls-3",
    type: "Schedule Change",
    title: "Request to reschedule session 3",
    description: "Teacher has conflict on Jan 24. Request to move to Jan 25.",
    priority: "Medium",
    status: "InProgress",
    requestedBy: "usr-teacher-3",
    requestedAt: "2025-01-12T10:00:00Z",
    assignedTo: "Academic Admin",
    dueDate: "2025-01-18",
    slaStatus: "OnTrack",
  },
  {
    id: "req-6",
    classId: "cls-2",
    studentId: "stu-15",
    type: "Parent Communication",
    title: "Parent meeting requested",
    description: "Parent wants to discuss student progress and behavior.",
    priority: "Medium",
    status: "Open",
    requestedBy: "usr-ta-2",
    requestedAt: "2025-01-10T15:30:00Z",
    dueDate: "2025-01-17",
    slaStatus: "OnTrack",
  },
  {
    id: "req-7",
    classId: "cls-4",
    type: "Material Request",
    title: "Advanced reading materials",
    description: "Class needs more challenging texts for advanced learners.",
    priority: "Low",
    status: "Open",
    requestedBy: "usr-teacher-1",
    requestedAt: "2025-01-11T09:15:00Z",
    dueDate: "2025-01-25",
    slaStatus: "OnTrack",
  },
  {
    id: "req-8",
    classId: "cls-5",
    type: "Technical Support",
    title: "WiFi connectivity issues",
    description: "Students unable to access online resources during class.",
    priority: "High",
    status: "InProgress",
    requestedBy: "usr-ta-4",
    requestedAt: "2025-01-09T14:40:00Z",
    assignedTo: "IT Support",
    dueDate: "2025-01-12",
    slaStatus: "AtRisk",
  },
  {
    id: "req-9",
    classId: "cls-1",
    studentId: "stu-8",
    type: "Attendance Concern",
    title: "Multiple absences follow-up",
    description: "Student missed 3 sessions. Need to contact guardian.",
    priority: "High",
    status: "Open",
    requestedBy: "usr-teacher-1",
    requestedAt: "2025-01-14T11:00:00Z",
    dueDate: "2025-01-16",
    slaStatus: "Overdue",
  },
  {
    id: "req-10",
    classId: "cls-3",
    type: "Academic Support",
    title: "Math remedial class request",
    description: "3 students need additional support with algebra concepts.",
    priority: "Medium",
    status: "Resolved",
    requestedBy: "usr-teacher-3",
    requestedAt: "2025-01-10T19:00:00Z",
    resolvedAt: "2025-01-13T10:00:00Z",
    resolution: "Remedial sessions scheduled for Saturdays.",
    slaStatus: "OnTrack",
  },
]

// Comment Snippets
export const mockCommentSnippets: CommentSnippet[] = [
  {
    id: "snip-1",
    category: "Positive - Participation",
    textEN: "Actively participated in class discussions",
    textVN: "Tích cực tham gia thảo luận trong lớp",
    tags: ["Engagement", "Speaking"],
    usageCount: 45,
  },
  {
    id: "snip-2",
    category: "Positive - Progress",
    textEN: "Shows significant improvement in [skill]",
    textVN: "Cho thấy sự tiến bộ đáng kể trong [kỹ năng]",
    tags: ["Improvement", "Progress"],
    usageCount: 38,
  },
  {
    id: "snip-3",
    category: "Needs Improvement - Homework",
    textEN: "Needs to complete homework assignments consistently",
    textVN: "Cần hoàn thành bài tập về nhà thường xuyên hơn",
    tags: ["Homework", "Responsibility"],
    usageCount: 22,
  },
  {
    id: "snip-4",
    category: "Needs Improvement - Attention",
    textEN: "Easily distracted, needs to focus more during lessons",
    textVN: "Dễ bị phân tâm, cần tập trung hơn trong giờ học",
    tags: ["Focus", "Behavior"],
    usageCount: 18,
  },
  {
    id: "snip-5",
    category: "Positive - Leadership",
    textEN: "Demonstrates strong leadership in group activities",
    textVN: "Thể hiện khả năng lãnh đạo tốt trong hoạt động nhóm",
    tags: ["Leadership", "Teamwork"],
    usageCount: 31,
  },
]

// Users
export const mockUsers: User[] = [
  {
    id: "usr-ta-1",
    name: "Nguyễn Văn A",
    email: "ta1@vus.edu.vn",
    role: "TA",
    centerId: "HCM_NTMK",
  },
  {
    id: "usr-ta-2",
    name: "Trần Thị B",
    email: "ta2@vus.edu.vn",
    role: "TA",
    centerId: "HCM_NTMK",
  },
  {
    id: "usr-ta-3",
    name: "Lê Văn C",
    email: "ta3@vus.edu.vn",
    role: "TA",
    centerId: "HCM_PXL",
  },
  {
    id: "usr-ta-4",
    name: "Phạm Thị D",
    email: "ta4@vus.edu.vn",
    role: "TA",
    centerId: "HCM_PXL",
  },
  {
    id: "usr-teacher-1",
    name: "Ms. Sarah Johnson",
    email: "teacher1@vus.edu.vn",
    role: "Teacher",
    centerId: "HCM_NTMK",
  },
  {
    id: "usr-teacher-2",
    name: "Mr. David Lee",
    email: "teacher2@vus.edu.vn",
    role: "Teacher",
    centerId: "HCM_NTMK",
  },
  {
    id: "usr-teacher-3",
    name: "Ms. Emily Chen",
    email: "teacher3@vus.edu.vn",
    role: "Teacher",
    centerId: "HCM_PXL",
  },
  {
    id: "usr-asa-1",
    name: "Nguyễn Thị Lan",
    email: "asa1@vus.edu.vn",
    role: "ASA",
    assignedCenterIds: ["HCM_NTMK", "HCM_PXL"],
  },
  {
    id: "usr-asa-2",
    name: "Trần Văn Minh",
    email: "asa2@vus.edu.vn",
    role: "ASA",
    assignedCenterIds: ["BDG_CMT8", "BDG_DA", "BDG_DA2"],
  },
  {
    id: "usr-tqm-1",
    name: "Dr. Jennifer Smith",
    email: "tqm1@vus.edu.vn",
    role: "TQM",
  },
  {
    id: "usr-sysadmin-1",
    name: "Admin VUS",
    email: "admin@vus.edu.vn",
    role: "SystemAdmin",
  },
]

// Periodic Comment Schedules
export const mockPeriodicSchedules: PeriodicCommentSchedule[] = [
  {
    classId: "cls-1",
    scheduledWeeks: [1, 4, 8, 11],
    programType: "Long",
  },
  {
    classId: "cls-2",
    scheduledWeeks: [5, 10],
    programType: "Short",
  },
  {
    classId: "cls-3",
    scheduledWeeks: [1, 4, 8, 11],
    programType: "Long",
  },
  {
    classId: "cls-4",
    scheduledWeeks: [1, 4, 8, 11],
    programType: "Long",
  },
  {
    classId: "cls-5",
    scheduledWeeks: [5, 10],
    programType: "Short",
  },
  // Add schedules for new classes
  {
    classId: "cls-7",
    scheduledWeeks: [1, 4, 8, 11],
    programType: "Long",
  },
  {
    classId: "cls-8",
    scheduledWeeks: [5, 10],
    programType: "Short",
  },
  {
    classId: "cls-9",
    scheduledWeeks: [1, 4, 8, 11],
    programType: "Long",
  },
  {
    classId: "cls-10",
    scheduledWeeks: [1, 4, 8, 11],
    programType: "Long",
  },
  {
    classId: "cls-11",
    scheduledWeeks: [5, 10],
    programType: "Short",
  },
  {
    classId: "cls-12",
    scheduledWeeks: [1, 4, 8, 11],
    programType: "Long",
  },
  {
    classId: "cls-13",
    scheduledWeeks: [1, 4, 8, 11],
    programType: "Long",
  },
  {
    classId: "cls-14",
    scheduledWeeks: [5, 10],
    programType: "Short",
  },
  {
    classId: "cls-15",
    scheduledWeeks: [1, 4, 8, 11],
    programType: "Long",
  },
  {
    classId: "cls-16",
    scheduledWeeks: [5, 10],
    programType: "Short",
  },
]

export const mockStudentSessionMetrics: StudentSessionMetrics[] = [
  // Session 1 - Class 1
  {
    id: "metric-1-1",
    sessionId: "ses-1",
    studentId: "stu-1", // Corrected from std-1
    skillsBreakdown: {
      speaking: 4,
      listening: 5,
      reading: 4,
      writing: 3,
    },
    lessonObjectivesMastered: true,
    participationLevel: "Active",
    attentionSpan: "Full",
    peerInteraction: "Good",
    englishUsage: true,
    homeworkCompletion: "Yes",
    homeworkQuality: "Excellent",
    parentFollowedUp: false,
    achievementsToday: "Volunteered to answer 5 questions, helped classmate with pronunciation",
    growthMoments: "First time using past tense correctly in full sentence",
    updatedBy: "usr-ta-1",
    updatedAt: "2025-01-06T10:00:00Z",
  },
  {
    id: "metric-1-2",
    sessionId: "ses-1",
    studentId: "stu-2", // Corrected from std-2
    skillsBreakdown: {
      speaking: 3,
      listening: 4,
      reading: 3,
      writing: 3,
    },
    lessonObjectivesMastered: true,
    participationLevel: "Moderate",
    attentionSpan: "Most",
    peerInteraction: "Good",
    englishUsage: true,
    homeworkCompletion: "Partial",
    homeworkQuality: "Good",
    parentFollowedUp: false,
    actionTaken: "Paired with stronger student for speaking activity",
    effectiveness: "Yes",
    nextSteps: "Continue pair work, monitor homework completion",
    achievementsToday: "Completed reading exercise independently",
    updatedBy: "usr-ta-1",
    updatedAt: "2025-01-06T10:00:00Z",
  },
  {
    id: "metric-1-3",
    sessionId: "ses-1",
    studentId: "stu-3", // Corrected from std-3
    skillsBreakdown: {
      speaking: 2,
      listening: 3,
      reading: 2,
      writing: 2,
    },
    lessonObjectivesMastered: false,
    participationLevel: "Passive",
    attentionSpan: "Struggled",
    peerInteraction: "NeedsSupport",
    englishUsage: false,
    homeworkCompletion: "No",
    parentFollowedUp: true,
    actionTaken: "Extra explanation after class, contacted parent about homework",
    effectiveness: "TBD",
    nextSteps: "Parent agreed to supervise homework, will check next session",
    updatedBy: "usr-teacher-1",
    updatedAt: "2025-01-06T11:00:00Z",
  },
]

export const mockParentCommunications: ParentCommunication[] = [
  {
    id: "comm-1",
    studentId: "stu-3", // Corrected from std-3
    date: "2025-01-06",
    topic: "Homework completion and class participation",
    method: "Phone",
    outcome: "Parent agreed to supervise homework daily. Will check workbook each evening.",
    followUpRequired: true,
    followUpDate: "2025-01-13",
    createdBy: "usr-teacher-1",
  },
  {
    id: "comm-2",
    studentId: "stu-5", // Corrected from std-5
    date: "2025-01-07",
    topic: "Excellent progress - share positive feedback",
    method: "App",
    outcome: "Parent very happy, student motivated to continue improvement",
    followUpRequired: false,
    createdBy: "usr-ta-1",
  },
]

export const mockStudentPhotos: StudentPhoto[] = [
  {
    id: "photo-1",
    studentId: "stu-1", // Nguyễn Minh An - HK6p girl
    sessionId: "ses-1",
    imageUrl: "/vus-hk-girl-presenting-english-class.jpg",
    caption: "Em Minh An tự tin thuyết trình về gia đình bằng tiếng Anh",
    takenBy: "usr-ta-1",
    takenAt: "2025-01-06T09:30:00Z",
    shareWithParents: true,
    tags: ["Speaking", "Confidence", "Presentation"],
  },
  {
    id: "photo-2",
    studentId: "stu-2", // Trần Bảo Châu - HK6p boy
    sessionId: "ses-1",
    imageUrl: "/vus-hk-kids-group-work.jpg",
    caption: "Làm việc nhóm - Em Bảo Châu thảo luận bài tập về động vật",
    takenBy: "usr-ta-1",
    takenAt: "2025-01-06T09:45:00Z",
    shareWithParents: true,
    tags: ["Teamwork", "Vocabulary"],
  },
  {
    id: "photo-3",
    studentId: "stu-5", // Đỗ Khánh Linh - HK6p girl
    sessionId: "ses-2",
    imageUrl: "/vus-sk-girl-reading-class.jpg",
    caption: "Em Khánh Linh đọc truyện tiếng Anh rất tốt",
    takenBy: "usr-ta-1",
    takenAt: "2025-01-13T08:20:00Z",
    shareWithParents: true,
    tags: ["Reading", "Progress"],
  },
  {
    id: "photo-4",
    studentId: "stu-11", // Nguyễn Hoàng Nam - SKG1s boy
    sessionId: "ses-3", // Corrected sessionId to ses-3 to match the structure
    imageUrl: "/vus-sk-boy-writing-activity.jpg",
    caption: "Em Hoàng Nam viết câu tiếng Anh đầu tiên của mình",
    takenBy: "usr-ta-2",
    takenAt: "2025-01-08T10:15:00Z",
    shareWithParents: true,
    tags: ["Writing", "Achievement"],
  },
  {
    id: "photo-5",
    studentId: "stu-28", // Hoàng Văn Sơn - YLC2 boy (assuming YLC2 is related to Class 3)
    sessionId: "ses-6", // Assuming this photo corresponds to a session in class cls-3
    imageUrl: "/vus-yl-teens-discussion.jpg",
    caption: "Em Văn Sơn dẫn dắt nhóm thảo luận về môi trường", // Updated caption for YLC2 context
    takenBy: "usr-ta-3", // Assuming TA for cls-3 is ta3
    takenAt: "2025-01-08T17:00:00Z", // Adjusted date for class 3
    shareWithParents: true,
    tags: ["Leadership", "Speaking", "Critical Thinking"],
  },
  {
    id: "photo-6",
    studentId: "stu-3", // Lê Phương Anh - HK6p girl
    sessionId: "ses-1",
    imageUrl: "/vus-hk-art-activity.jpg",
    caption: "Em Phương Anh sáng tạo tranh về family members",
    takenBy: "usr-ta-1",
    takenAt: "2025-01-06T10:00:00Z",
    shareWithParents: true,
    tags: ["Creativity", "Vocabulary", "Art"],
  },
  {
    id: "photo-7",
    studentId: "stu-15", // Trần Ngọc Bích - SKG1s girl
    sessionId: "ses-4",
    imageUrl: "/vus-sk-computer-lab.jpg",
    caption: "Em Ngọc Bích chơi game học từ vựng trên máy tính",
    takenBy: "usr-ta-2",
    takenAt: "2025-01-08T10:15:00Z",
    shareWithParents: true,
    tags: ["Technology", "Vocabulary", "Engagement"],
  },
  {
    id: "photo-8",
    studentId: "stu-125", // Phan Quốc Bảo - YLC2 girl (assuming YLC2 is related to Class 12)
    sessionId: "ses-123", // Corrected sessionId to match actual ID structure
    imageUrl: "/vus-yl-presentation-skills.jpg",
    caption: "Em Quốc Bảo thuyết trình đề tài về văn hóa Việt Nam", // Updated caption for YLC2 context
    takenBy: "usr-ta-3", // Assuming TA for cls-12 is ta3
    takenAt: "2025-01-16T17:00:00Z", // Adjusted date for class 12
    shareWithParents: true,
    tags: ["Presentation", "Culture", "Confidence"],
  },
  {
    id: "photo-9",
    studentId: "stu-6", // Hoàng Minh Khôi - HK6p boy
    sessionId: "ses-2",
    imageUrl: "/vus-hk-phonics-lesson.jpg",
    caption: "Em Minh Khôi học phonics với cô giáo",
    takenBy: "usr-ta-1",
    takenAt: "2025-01-13T09:00:00Z",
    shareWithParents: true,
    tags: ["Phonics", "Listening", "Participation"],
  },
  {
    id: "photo-10",
    studentId: "stu-18", // Vũ Quốc Huy - SKG1s boy
    sessionId: "ses-4", // Corrected sessionId to match actual ID structure
    imageUrl: "/vus-sk-science-english.jpg",
    caption: "Em Quốc Huy làm thí nghiệm khoa học bằng tiếng Anh",
    takenBy: "usr-ta-2",
    takenAt: "2025-01-07T15:00:00Z", // Adjusted date for class 2, session 1
    shareWithParents: true,
    tags: ["Science", "Vocabulary", "Experiment"],
  },
]

// Guidelines
export const mockGuidelines: Guideline[] = [
  {
    id: "guide-4.1",
    section: "4.1",
    title: "How to Fill Class Report, Report Booklet & MCB",
    titleVN: "Hướng dẫn điền Class Report, Report Booklet & MCB",
    content: `Guidelines for completing daily and periodic class reports:

**Daily Class Reports (White Paper)**
- Complete for EVERY session with 5 students minimum
- Include: Today's lesson, Attendance, Home assignment, Comments (5 students)
- Use F.A.S.T principles: Frequent, Accurate, Specific, Timely
- Both TA signature and Teacher signature required

**Periodic Comments (Colored Paper)**
- Schedule varies by program:
  * Long programs: Weeks 1, 4, 8, 11
  * Short programs: Weeks 5, 10
- Must include positive observations and areas for improvement
- Provide specific parent support suggestions

**Report Booklet**
- Summarize student progress over the term
- Include skill assessments and recommendations
- Teacher review required before distribution

**MCB (My Class Book)**
- Document class activities and milestones
- Include photos when appropriate
- Share with parents at term end`,
    contentVN: `Hướng dẫn hoàn thành báo cáo lớp hàng ngày và định kỳ:

**Báo cáo lớp hàng ngày (Giấy trắng)**
- Hoàn thành cho MỖI buổi học với tối thiểu 5 học viên
- Bao gồm: Bài học hôm nay, Điểm danh, Bài tập về nhà, Nhận xét (5 học viên)
- Sử dụng nguyên tắc F.A.S.T: Thường xuyên, Chính xác, Cụ thể, Kịp thời
- Cần chữ ký cả TA và Teacher

**Nhận xét định kỳ (Giấy màu)**
- Lịch trình tùy chương trình:
  * Chương trình dài: Tuần 1, 4, 8, 11
  * Chương trình ngắn: Tuần 5, 10
- Phải bao gồm quan sát tích cực và điểm cần cải thiện
- Cung cấp gợi ý hỗ trợ cụ thể cho phụ huynh

**Report Booklet**
- Tóm tắt tiến bộ học viên trong kỳ
- Bao gồm đánh giá kỹ năng và khuyến nghị
- Cần Teacher xem xét trước khi phát

**MCB (My Class Book)**
- Ghi lại hoạt động và cột mốc của lớp
- Bao gồm ảnh khi phù hợp
- Chia sẻ với phụ huynh cuối kỳ`,
    contextTriggers: ["class-report", "daily-checklist"],
    examples: [
      "Today's lesson: Unit 3 - Body Parts (Pages 10-15)",
      "Positive comment: Em An participated actively and helped peers",
      "Areas for improvement: Em Minh needs practice with pronunciation at home",
    ],
  },
  {
    id: "guide-4.2",
    section: "4.2",
    title: "Classroom Instructions in English",
    titleVN: "Các câu lệnh trong lớp học bằng tiếng Anh",
    content: `Essential English phrases for classroom management:

**Starting Class**
- "Good morning/afternoon, everyone!"
- "Let's start our lesson"
- "Open your books to page..."

**During Activities**
- "Listen carefully"
- "Repeat after me"
- "Work in pairs/groups"
- "Raise your hand if you know the answer"
- "Take turns"

**Classroom Management**
- "Pay attention, please"
- "Eyes on me"
- "Hands up, please"
- "Sit down, please"
- "Be quiet, please"

**Positive Reinforcement**
- "Good job!"
- "Well done!"
- "Excellent work!"
- "Keep it up!"
- "I'm proud of you!"

**Ending Class**
- "Time's up"
- "Put your things away"
- "See you next time"
- "Have a nice day!"`,
    contentVN: `Các cụm từ tiếng Anh quan trọng cho quản lý lớp học:

**Bắt đầu lớp**
- "Good morning/afternoon, everyone!" (Chào buổi sáng/chiều các em!)
- "Let's start our lesson" (Chúng ta bắt đầu bài học nhé)
- "Open your books to page..." (Mở sách ra trang...)

**Trong hoạt động**
- "Listen carefully" (Lắng nghe cẩn thận)
- "Repeat after me" (Lặp lại theo cô)
- "Work in pairs/groups" (Làm việc theo cặp/nhóm)
- "Raise your hand if you know the answer" (Giơ tay nếu em biết câu trả lời)
- "Take turns" (Lần lượt nhé)

**Quản lý lớp**
- "Pay attention, please" (Chú ý nhé các em)
- "Eyes on me" (Nhìn cô đây)
- "Hands up, please" (Giơ tay lên)
- "Sit down, please" (Ngồi xuống)
- "Be quiet, please" (Im lặng nhé)

**Động viên tích cực**
- "Good job!" (Làm tốt lắm!)
- "Well done!" (Xuất sắc!)
- "Excellent work!" (Làm bài tuyệt vời!)
- "Keep it up!" (Cố gắng tiếp nhé!)
- "I'm proud of you!" (Cô rất tự hào về em!)

**Kết thúc lớp**
- "Time's up" (Hết giờ rồi)
- "Put your things away" (Cất đồ vào)
- "See you next time" (Hẹn gặp lại các em)
- "Have a nice day!" (Chúc một ngày tốt lành!)`,
    contextTriggers: ["attendance", "classroom-management"],
    examples: ["Good job, em Lan! Keep up the great work!", "Eyes on me, please. We're starting a new activity."],
  },
  {
    id: "guide-4.3",
    section: "4.3",
    title: "F.A.S.T & S.B.I Feedback Principles",
    titleVN: "Nguyên tắc F.A.S.T & S.B.I cho phản hồi",
    content: `Professional feedback framework for student comments:

**F.A.S.T Principles**
- **Frequent**: Provide feedback regularly, not just when problems arise
- **Accurate**: Base comments on specific observations and evidence
- **Specific**: Use concrete examples instead of general statements
- **Timely**: Give feedback soon after the observed behavior

**S.B.I Framework**
- **Situation**: Describe when and where the behavior occurred
- **Behavior**: State what you specifically observed (factual, not judgmental)
- **Impact**: Explain the effect of the behavior on learning/classmates

**Examples:**
❌ Poor: "Em An is lazy"
✅ Good (SBI): "During group work today (S), em An sat quietly without participating (B), which meant his team couldn't complete the task (I)"

❌ Poor: "Em Minh is excellent"
✅ Good (SBI): "In today's speaking activity (S), em Minh volunteered to present first and spoke clearly (B), which encouraged other students to participate (I)"

**For Areas of Improvement:**
- Always pair with a suggestion for parents
- Focus on specific skills to practice
- Provide actionable next steps
- Maintain positive, supportive tone`,
    contentVN: `Khung phản hồi chuyên nghiệp cho nhận xét học viên:

**Nguyên tắc F.A.S.T**
- **Frequent (Thường xuyên)**: Cung cấp phản hồi đều đặn, không chỉ khi có vấn đề
- **Accurate (Chính xác)**: Dựa trên quan sát và bằng chứng cụ thể
- **Specific (Cụ thể)**: Dùng ví dụ cụ thể thay vì nhận xét chung chung
- **Timely (Kịp thời)**: Đưa phản hồi ngay sau hành vi quan sát được

**Khung S.B.I**
- **Situation (Tình huống)**: Mô tả khi nào và ở đâu hành vi xảy ra
- **Behavior (Hành vi)**: Nêu điều bạn quan sát được (thực tế, không phán xét)
- **Impact (Tác động)**: Giải thích ảnh hưởng của hành vi đến việc học/bạn bè

**Ví dụ:**
❌ Kém: "Em An lười biếng"
✅ Tốt (SBI): "Trong hoạt động nhóm hôm nay (S), em An ngồi im lặng không tham gia (B), khiến nhóm không hoàn thành nhiệm vụ (I)"

❌ Kém: "Em Minh xuất sắc"
✅ Tốt (SBI): "Trong hoạt động nói hôm nay (S), em Minh tự nguyện trình bày đầu tiên và nói rõ ràng (B), động viên các bạn khác tham gia (I)"

**Cho điểm cần cải thiện:**
- Luôn kết hợp với gợi ý cho phụ huynh
- Tập trung vào kỹ năng cụ thể cần luyện tập
- Cung cấp bước tiếp theo có thể thực hiện
- Duy trì giọng điệu tích cực, hỗ trợ`,
    contextTriggers: ["student-notes", "comments"],
    examples: [
      "Situation: During today's reading activity | Behavior: Em struggled with pronunciation | Impact: This affected comprehension. Suggestion: Practice reading aloud at home for 10 minutes daily.",
    ],
  },
  {
    id: "guide-4.4",
    section: "4.4",
    title: "New Student Welcome & Support Checklist",
    titleVN: "Danh sách kiểm tra chào đón và hỗ trợ học viên mới",
    content: `6-Step process for welcoming new students:

**Step 1: Before First Class**
- Review student profile and placement test results
- Prepare name tag and welcome materials
- Inform class about new student joining

**Step 2: First Day Welcome (Before Class)**
- Greet student and parent warmly at entrance
- Give campus tour (bathroom, water station, office)
- Introduce to Teacher and TA

**Step 3: Classroom Introduction**
- Introduce new student to classmates
- Assign a "buddy" to help them settle in
- Explain classroom rules and routines

**Step 4: During First Session**
- Observe closely to assess actual level
- Provide extra support and encouragement
- Check understanding frequently

**Step 5: After First Session**
- Talk privately with student about their experience
- Address any concerns or questions
- Communicate with parents about first day

**Step 6: Follow-up (First 2 Weeks)**
- Monitor participation and engagement daily
- Provide additional practice materials if needed
- Regular check-ins with student and parents
- Document progress in Class Report

**Special Attention Points:**
- New students may be shy or anxious
- They need time to adapt to class pace
- Extra positive reinforcement is crucial
- Watch for signs of struggle or discomfort`,
    contentVN: `Quy trình 6 bước chào đón học viên mới:

**Bước 1: Trước buổi học đầu tiên**
- Xem xét hồ sơ học viên và kết quả test đầu vào
- Chuẩn bị bảng tên và tài liệu chào mừng
- Thông báo lớp về học viên mới sắp tham gia

**Bước 2: Chào đón ngày đầu (Trước lớp)**
- Chào đón học viên và phụ huynh nhiệt tình ở cổng
- Tham quan cơ sở (nhà vệ sinh, nước uống, văn phòng)
- Giới thiệu với Teacher và TA

**Bước 3: Giới thiệu trong lớp**
- Giới thiệu học viên mới với các bạn
- Chỉ định một "bạn đồng hành" giúp đỡ
- Giải thích quy tắc và thói quen lớp học

**Bước 4: Trong buổi học đầu tiên**
- Quan sát kỹ để đánh giá trình độ thực tế
- Cung cấp hỗ trợ và động viên thêm
- Kiểm tra sự hiểu biết thường xuyên

**Bước 5: Sau buổi học đầu tiên**
- Trò chuyện riêng với học viên về trải nghiệm
- Giải quyết bất kỳ lo lắng hoặc câu hỏi
- Giao tiếp với phụ huynh về ngày đầu tiên

**Bước 6: Theo dõi (2 tuần đầu)**
- Theo dõi sự tham gia và hòa nhập hàng ngày
- Cung cấp tài liệu luyện tập bổ sung nếu cần
- Kiểm tra thường xuyên với học viên và phụ huynh
- Ghi lại tiến bộ trong Class Report

**Điểm đặc biệt chú ý:**
- Học viên mới có thể nhút nhát hoặc lo lắng
- Họ cần thời gian để thích nghi với nhịp độ lớp
- Củng cố tích cực thêm là rất quan trọng
- Chú ý dấu hiệu gặp khó khăn hoặc không thoải mái`,
    contextTriggers: ["new-student"],
    examples: [
      "Day 1: Welcomed em Lan and parent, showed them around campus, introduced to class",
      "Week 1: Em Lan still quiet during activities, assigned em Minh as buddy",
      "Week 2: Em Lan participated more, praised her effort in front of class",
    ],
  },
]

export const mockSystemConfig: SystemConfig = {
  id: "sys-config-1",
  riskLevelThresholds: {
    attendanceRedThreshold: 75,
    attendanceYellowThreshold: 90,
    negativeNotesRedCount: 3,
    negativeNotesYellowCount: 2,
    overdueRequestsRedCount: 2,
    overdueRequestsYellowCount: 1,
    consecutiveAbsencesRed: 3,
    consecutiveAbsencesYellow: 2,
  },
  slaSettings: {
    specialRequestResponseTime: 24,
    reportApprovalTime: 48,
    parentCommunicationTime: 12,
  },
  notificationSettings: {
    enabled: true,
    emailDigestTime: "08:00",
    reportReminderHoursBefore: 24,
    slaWarningPercentage: 80,
  },
  featureFlags: {
    speechToText: true,
    autoSummarization: true,
    photoUpload: true,
    exportToPDF: true,
  },
  updatedBy: "usr-sysadmin-1",
  updatedAt: "2025-02-01T00:00:00Z",
}
