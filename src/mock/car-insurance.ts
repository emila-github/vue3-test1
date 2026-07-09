/**
 * 车险投保 Mock 数据
 *
 * 接口：
 *   GET  /car-insurance/list      — 列表查询（支持搜索/分页/状态筛选）
 *   GET  /car-insurance/:id       — 详情查询
 *   POST /car-insurance           — 新增投保
 *   PUT  /car-insurance/:id       — 编辑投保
 *   DEL  /car-insurance/:id       — 删除投保
 *   POST /car-insurance/upload    — 图片上传
 */
import type { MockRoute } from './types'
import fs from 'node:fs'
import path from 'node:path'

// ==================== 存量数据 ====================

interface CarInsurance {
  id: number
  plateNo: string
  ownerName: string
  ownerPhone: string
  carBrand: string
  carModel: string
  carYear: number
  vin: string
  engineNo: string
  insuranceType: string
  insuranceStart: string
  insuranceEnd: string
  deductible: number
  estimatedValue: number
  driverLicenseFront: string
  driverLicenseBack: string
  carPhoto: string
  status: '待审核' | '已生效' | '已过期'
  coverageArea: string
  agreeTerms: boolean
  notes: string
  createTime: string
  updateTime: string
}

let idSeq = 100

const now = new Date()
function fmtDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 辅助函数：生成某一天的数据
function dayOffset(offset: number) {
  return fmtDate(new Date(now.getTime() - offset * 86400000))
}
function dayTime(offset: number, hour: number, min: number) {
  const d = new Date(now.getTime() - offset * 86400000)
  d.setHours(hour, min, 0, 0)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(hour)}:${pad(min)}:00`
}

const seedRecords: Array<Omit<CarInsurance, 'id'>> = [
  // ===== 第1页（10条，最近） =====
  { plateNo: '粤B·88888',  ownerName: '张三', ownerPhone: '13800138001', carBrand: '宝马',   carModel: 'X5 xDrive40i',      carYear: 2, vin: 'WBA1234567890ABC', engineNo: 'B58B30A-001',  insuranceType: '全险',   insuranceStart: dayOffset(30),  insuranceEnd: dayOffset(30 + 365), deductible: 500,  estimatedValue: 650000, status: '已生效', coverageArea: '广东省/深圳市/南山区',     agreeTerms: true,  notes: '新车首保',                                     createTime: dayTime(30, 9, 30),  updateTime: dayTime(30, 9, 30) },
  { plateNo: '京A·66666',  ownerName: '李四', ownerPhone: '13900139002', carBrand: '奔驰',   carModel: 'C260L',               carYear: 3, vin: 'WDD1234567890DEF', engineNo: 'M254-002',     insuranceType: '商业险', insuranceStart: dayOffset(60),  insuranceEnd: dayOffset(60 + 365),  deductible: 1000, estimatedValue: 350000, status: '已生效', coverageArea: '北京市/北京市/朝阳区',     agreeTerms: true,  notes: '',                                            createTime: dayTime(60, 14, 22), updateTime: dayTime(15, 10, 15) },
  { plateNo: '沪C·12345',  ownerName: '王五', ownerPhone: '13700137003', carBrand: '奥迪',   carModel: 'A6L 45TFSI',         carYear: 5, vin: 'WAU1234567890GHI', engineNo: 'EA888-003',    insuranceType: '交强险', insuranceStart: dayOffset(10),  insuranceEnd: dayOffset(10 + 365),  deductible: 0,    estimatedValue: 180000, status: '已过期', coverageArea: '上海市/上海市/浦东新区',     agreeTerms: true,  notes: '仅续保交强险',                                 createTime: dayTime(90, 16, 45), updateTime: dayTime(90, 16, 45) },
  { plateNo: '浙A·99999',  ownerName: '赵六', ownerPhone: '13600136004', carBrand: '特斯拉', carModel: 'Model Y 长续航',      carYear: 1, vin: 'LRW1234567890JKL', engineNo: '3D7-004',     insuranceType: '全险',   insuranceStart: dayOffset(5),   insuranceEnd: dayOffset(5 + 365),   deductible: 300,  estimatedValue: 280000, status: '待审核', coverageArea: '浙江省/杭州市/西湖区',     agreeTerms: true,  notes: '新能源车型，需确认新能源专属条款',             createTime: dayTime(5, 8, 0),   updateTime: dayTime(5, 8, 0) },
  { plateNo: '苏E·56789',  ownerName: '孙七', ownerPhone: '13500135005', carBrand: '丰田',   carModel: '卡罗拉 双擎',        carYear: 4, vin: 'JT1234567890MNO',  engineNo: '2ZR-005',     insuranceType: '商业险', insuranceStart: dayOffset(45),  insuranceEnd: dayOffset(45 + 365),  deductible: 800,  estimatedValue: 120000, status: '已生效', coverageArea: '江苏省/苏州市/工业园区', agreeTerms: true,  notes: '',                                            createTime: dayTime(120, 11, 30), updateTime: dayTime(120, 11, 30) },
  { plateNo: '鲁B·24680',  ownerName: '周八', ownerPhone: '13400134006', carBrand: '本田',   carModel: '雅阁 260TURBO',      carYear: 3, vin: 'LHG1234567890PQR', engineNo: 'L15BN-006',    insuranceType: '全险',   insuranceStart: dayOffset(20),  insuranceEnd: dayOffset(20 + 365),  deductible: 500,  estimatedValue: 220000, status: '已生效', coverageArea: '山东省/青岛市/市南区',     agreeTerms: true,  notes: '',                                            createTime: dayTime(50, 10, 0),  updateTime: dayTime(20, 9, 15) },
  { plateNo: '川A·13579',  ownerName: '吴九', ownerPhone: '13300133007', carBrand: '大众',   carModel: '帕萨特 330TSI',      carYear: 6, vin: 'LSV1234567890STU', engineNo: 'EA888-007',    insuranceType: '商业险', insuranceStart: dayOffset(35),  insuranceEnd: dayOffset(35 + 365),  deductible: 1000, estimatedValue: 150000, status: '已过期', coverageArea: '四川省/成都市/武侯区',     agreeTerms: true,  notes: '老车续保，保费上浮',                           createTime: dayTime(80, 15, 30), updateTime: dayTime(80, 15, 30) },
  { plateNo: '陕A·88866',  ownerName: '郑十', ownerPhone: '13200132008', carBrand: '比亚迪', carModel: '汉 EV 创世版',        carYear: 2, vin: 'LGX1234567890VWX', engineNo: 'BYD-008',      insuranceType: '全险',   insuranceStart: dayOffset(15),  insuranceEnd: dayOffset(15 + 365),  deductible: 0,    estimatedValue: 260000, status: '待审核', coverageArea: '陕西省/西安市/雁塔区',     agreeTerms: true,  notes: '新能源首年全险',                               createTime: dayTime(15, 16, 20), updateTime: dayTime(15, 16, 20) },
  { plateNo: '粤C·66888',  ownerName: '陈一', ownerPhone: '13100131009', carBrand: '蔚来',   carModel: 'ET5 100kWh',         carYear: 1, vin: 'LNA1234567890YZA', engineNo: 'NIO-009',      insuranceType: '交强险', insuranceStart: dayOffset(3),   insuranceEnd: dayOffset(3 + 365),   deductible: 0,    estimatedValue: 320000, status: '待审核', coverageArea: '广东省/珠海市/香洲区',     agreeTerms: false, notes: '换电车型，需确认保额',                           createTime: dayTime(3, 13, 45),  updateTime: dayTime(3, 13, 45) },
  { plateNo: '闽D·77777',  ownerName: '刘二', ownerPhone: '13000130010', carBrand: '奔驰',   carModel: 'E300L 豪华型',       carYear: 4, vin: 'W1K1234567890BCD', engineNo: 'M264-010',    insuranceType: '商业险', insuranceStart: dayOffset(40),  insuranceEnd: dayOffset(40 + 365),  deductible: 2000, estimatedValue: 480000, status: '已生效', coverageArea: '福建省/厦门市/思明区',     agreeTerms: true,  notes: '',                                            createTime: dayTime(70, 8, 30),  updateTime: dayTime(40, 11, 0) },

  // ===== 第2页（10条） =====
  { plateNo: '津A·12388',  ownerName: '黄三', ownerPhone: '12900129011', carBrand: '宝马',   carModel: '3系 325Li',          carYear: 2, vin: 'WBA2234567890EFG', engineNo: 'B48B20-011',   insuranceType: '全险',   insuranceStart: dayOffset(70),  insuranceEnd: dayOffset(70 + 365),  deductible: 500,  estimatedValue: 320000, status: '已生效', coverageArea: '天津市/天津市/和平区',     agreeTerms: true,  notes: '',                                            createTime: dayTime(100, 9, 15), updateTime: dayTime(70, 14, 30) },
  { plateNo: '渝A·23456',  ownerName: '邓四', ownerPhone: '12800128012', carBrand: '奥迪',   carModel: 'Q5L 45TFSI',         carYear: 5, vin: 'WAU3234567890HIJ', engineNo: 'EA888-012',    insuranceType: '商业险', insuranceStart: dayOffset(55),  insuranceEnd: dayOffset(55 + 365),  deductible: 1000, estimatedValue: 280000, status: '已过期', coverageArea: '重庆市/重庆市/渝北区',     agreeTerms: true,  notes: '即将到期，提示续保',                             createTime: dayTime(110, 10, 0), updateTime: dayTime(110, 10, 0) },
  { plateNo: '琼B·34567',  ownerName: '许五', ownerPhone: '12700127013', carBrand: '特斯拉', carModel: 'Model 3 标准续航',   carYear: 3, vin: 'LRW3234567890KLM', engineNo: '3D7-013',      insuranceType: '交强险', insuranceStart: dayOffset(80),  insuranceEnd: dayOffset(80 + 365),  deductible: 0,    estimatedValue: 220000, status: '已生效', coverageArea: '海南省/三亚市/天涯区',     agreeTerms: true,  notes: '',                                            createTime: dayTime(130, 14, 0), updateTime: dayTime(130, 14, 0) },
  { plateNo: '湘A·45678',  ownerName: '何六', ownerPhone: '12600126014', carBrand: '丰田',   carModel: '凯美瑞 2.5G',        carYear: 2, vin: 'JTA4234567890NOP', engineNo: 'A25A-014',     insuranceType: '全险',   insuranceStart: dayOffset(65),  insuranceEnd: dayOffset(65 + 365),  deductible: 0,    estimatedValue: 190000, status: '待审核', coverageArea: '湖南省/长沙市/岳麓区',     agreeTerms: true,  notes: '',                                            createTime: dayTime(65, 11, 30), updateTime: dayTime(65, 11, 30) },
  { plateNo: '豫A·56789',  ownerName: '冯七', ownerPhone: '12500125015', carBrand: '大众',   carModel: '途观L 380TSI',       carYear: 6, vin: 'LSV5234567890QRS', engineNo: 'EA888-015',    insuranceType: '商业险', insuranceStart: dayOffset(90),  insuranceEnd: dayOffset(90 + 365),  deductible: 1500, estimatedValue: 110000, status: '已过期', coverageArea: '河南省/郑州市/金水区',     agreeTerms: true,  notes: '老车高风险，保费系数1.2',                       createTime: dayTime(150, 8, 45), updateTime: dayTime(150, 8, 45) },
  { plateNo: '鄂A·67890',  ownerName: '曹八', ownerPhone: '12400124016', carBrand: '比亚迪', carModel: '宋 PLUS DM-i',        carYear: 1, vin: 'LGX6234567890TUV', engineNo: 'BYD-016',      insuranceType: '全险',   insuranceStart: dayOffset(50),  insuranceEnd: dayOffset(50 + 365),  deductible: 300,  estimatedValue: 160000, status: '已生效', coverageArea: '湖北省/武汉市/洪山区',     agreeTerms: true,  notes: '混动车型，新能源优惠',                           createTime: dayTime(95, 16, 20), updateTime: dayTime(50, 9, 0) },
  { plateNo: '赣A·78901',  ownerName: '彭九', ownerPhone: '12300123017', carBrand: '本田',   carModel: 'CR-V 240TURBO',      carYear: 4, vin: 'LHG7234567890WXY', engineNo: 'L15BL-017',    insuranceType: '交强险', insuranceStart: dayOffset(75),  insuranceEnd: dayOffset(75 + 365),  deductible: 0,    estimatedValue: 170000, status: '已生效', coverageArea: '江西省/南昌市/红谷滩区',   agreeTerms: true,  notes: '',                                            createTime: dayTime(115, 12, 0), updateTime: dayTime(115, 12, 0) },
  { plateNo: '皖A·89012',  ownerName: '潘十', ownerPhone: '12200122018', carBrand: '蔚来',   carModel: 'ES6 性能版',         carYear: 2, vin: 'LNA8234567890ZAB', engineNo: 'NIO-018',      insuranceType: '商业险', insuranceStart: dayOffset(60),  insuranceEnd: dayOffset(60 + 365),  deductible: 800,  estimatedValue: 350000, status: '待审核', coverageArea: '安徽省/合肥市/蜀山区',     agreeTerms: false, notes: '换电车型，电池租赁',                             createTime: dayTime(60, 10, 15), updateTime: dayTime(60, 10, 15) },
  { plateNo: '桂A·90123',  ownerName: '韦一', ownerPhone: '12100121019', carBrand: '丰田',   carModel: 'RAV4 荣放 2.0L',     carYear: 3, vin: 'JTA9234567890CDE', engineNo: 'M20A-019',     insuranceType: '全险',   insuranceStart: dayOffset(38),  insuranceEnd: dayOffset(38 + 365),  deductible: 500,  estimatedValue: 200000, status: '已生效', coverageArea: '广西壮族自治区/南宁市/青秀区', agreeTerms: true,  notes: '',                                            createTime: dayTime(85, 13, 30), updateTime: dayTime(38, 8, 15) },
  { plateNo: '贵A·01234',  ownerName: '蒋二', ownerPhone: '12000120020', carBrand: '奥迪',   carModel: 'A4L 40TFSI',         carYear: 4, vin: 'WAU9234567890FGH', engineNo: 'EA888-020',    insuranceType: '交强险', insuranceStart: dayOffset(85),  insuranceEnd: dayOffset(85 + 365),  deductible: 0,    estimatedValue: 230000, status: '已过期', coverageArea: '贵州省/贵阳市/观山湖区',   agreeTerms: true,  notes: '到期提醒：需在30日内续保',                      createTime: dayTime(140, 15, 0), updateTime: dayTime(140, 15, 0) },

  // ===== 第3页（8条，不足一页触发 finished） =====
  { plateNo: '云A·13580',  ownerName: '沈三', ownerPhone: '11900119021', carBrand: '奔驰',   carModel: 'GLC 300L',           carYear: 2, vin: 'W1K0234567890IJK', engineNo: 'M264-021',    insuranceType: '全险',   insuranceStart: dayOffset(95),  insuranceEnd: dayOffset(95 + 365),  deductible: 0,    estimatedValue: 450000, status: '已生效', coverageArea: '云南省/昆明市/五华区',     agreeTerms: true,  notes: '',                                            createTime: dayTime(145, 8, 30), updateTime: dayTime(145, 8, 30) },
  { plateNo: '辽A·24691',  ownerName: '韩四', ownerPhone: '11800118022', carBrand: '大众',   carModel: '迈腾 380TSI',        carYear: 5, vin: 'LSV1234567890LMN', engineNo: 'EA888-022',    insuranceType: '商业险', insuranceStart: dayOffset(100), insuranceEnd: dayOffset(100 + 365), deductible: 1200, estimatedValue: 140000, status: '待审核', coverageArea: '辽宁省/沈阳市/和平区',     agreeTerms: true,  notes: '',                                            createTime: dayTime(100, 14, 15), updateTime: dayTime(100, 14, 15) },
  { plateNo: '吉A·35702',  ownerName: '杨五', ownerPhone: '11700117023', carBrand: '比亚迪', carModel: '海豹 EV 650km',       carYear: 1, vin: 'LGX1234567890OPQ', engineNo: 'BYD-023',      insuranceType: '全险',   insuranceStart: dayOffset(88),  insuranceEnd: dayOffset(88 + 365),  deductible: 200,  estimatedValue: 210000, status: '待审核', coverageArea: '吉林省/长春市/南关区',     agreeTerms: true,  notes: '纯电车型，需额外购买电池险',                     createTime: dayTime(88, 10, 0),  updateTime: dayTime(88, 10, 0) },
  { plateNo: '黑A·46813',  ownerName: '朱六', ownerPhone: '11600116024', carBrand: '本田',   carModel: '思域 240TURBO',      carYear: 3, vin: 'LHG2234567890RST', engineNo: 'L15C8-024',    insuranceType: '交强险', insuranceStart: dayOffset(72),  insuranceEnd: dayOffset(72 + 365),  deductible: 0,    estimatedValue: 130000, status: '已生效', coverageArea: '黑龙江省/哈尔滨市/道里区', agreeTerms: true,  notes: '',                                            createTime: dayTime(135, 9, 45), updateTime: dayTime(135, 9, 45) },
  { plateNo: '甘A·57924',  ownerName: '马七', ownerPhone: '11500115025', carBrand: '丰田',   carModel: '汉兰达 2.5L 双擎',   carYear: 4, vin: 'JTA3234567890UVW', engineNo: 'A25D-025',     insuranceType: '商业险', insuranceStart: dayOffset(68),  insuranceEnd: dayOffset(68 + 365),  deductible: 1000, estimatedValue: 270000, status: '已过期', coverageArea: '甘肃省/兰州市/城关区',     agreeTerms: true,  notes: '到期已过期，需重新投保',                         createTime: dayTime(160, 11, 0), updateTime: dayTime(160, 11, 0) },
  { plateNo: '新A·68035',  ownerName: '胡八', ownerPhone: '11400114026', carBrand: '特斯拉', carModel: 'Model S Plaid',        carYear: 2, vin: '5YJ3234567890XYZA', engineNo: 'T5L-026',      insuranceType: '全险',   insuranceStart: dayOffset(42),  insuranceEnd: dayOffset(42 + 365),  deductible: 500,  estimatedValue: 850000, status: '已生效', coverageArea: '新疆维吾尔自治区/乌鲁木齐市/天山区', agreeTerms: true,  notes: '高性能车型，保额较高',                         createTime: dayTime(125, 13, 20), updateTime: dayTime(125, 13, 20) },
  { plateNo: '藏A·79146',  ownerName: '林九', ownerPhone: '11300113027', carBrand: '本田',   carModel: '型格 240TURBO',      carYear: 1, vin: 'LHG4234567890BCD', engineNo: 'L15C9-027',    insuranceType: '交强险', insuranceStart: dayOffset(25),  insuranceEnd: dayOffset(25 + 365),  deductible: 0,    estimatedValue: 140000, status: '待审核', coverageArea: '西藏自治区/拉萨市/城关区',   agreeTerms: true,  notes: '',                                            createTime: dayTime(55, 16, 0),  updateTime: dayTime(55, 16, 0) },
  { plateNo: '青A·80257',  ownerName: '罗十', ownerPhone: '11200112028', carBrand: '奥迪',   carModel: 'Q3 35TFSI',          carYear: 6, vin: 'WAU4234567890EFG', engineNo: 'EA211-028',    insuranceType: '商业险', insuranceStart: dayOffset(110), insuranceEnd: dayOffset(110 + 365), deductible: 2000, estimatedValue: 100000, status: '已过期', coverageArea: '青海省/西宁市/城西区',     agreeTerms: true,  notes: '老车高免赔额，降低保费',                         createTime: dayTime(170, 10, 30), updateTime: dayTime(170, 10, 30) },
]

function buildRecord(r: Omit<CarInsurance, 'id'>, idx: number): CarInsurance {
  return { id: idSeq++, ...r } as CarInsurance
}

const data: CarInsurance[] = seedRecords.map(buildRecord)

// ==================== 图片上传目录 ====================
const uploadDir = path.resolve('src/assets/upload')

// ==================== 路由 ====================

function uuid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const routes: MockRoute[] = [
  // 列表查询
  {
    url: '/car-insurance/list',
    method: 'GET',
    response: (req) => {
      const u = new URL(req.url!, 'http://localhost')
      const keyword = u.searchParams.get('keyword') || ''
      const status = u.searchParams.get('status') || ''
      const page = parseInt(u.searchParams.get('page') || '1', 10)
      const pageSize = parseInt(u.searchParams.get('pageSize') || '10', 10)

      let filtered = [...data]

      if (keyword) {
        const kw = keyword.toLowerCase()
        filtered = filtered.filter(
          (d) =>
            d.plateNo.toLowerCase().includes(kw) ||
            d.ownerName.toLowerCase().includes(kw) ||
            d.ownerPhone.includes(kw) ||
            d.vin.toLowerCase().includes(kw),
        )
      }

      if (status) {
        filtered = filtered.filter((d) => d.status === status)
      }

      // 按创建时间倒序
      filtered.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())

      const total = filtered.length
      const start = (page - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)

      return { code: 200, data: { list, total, page, pageSize }, message: 'ok' }
    },
  },

  // 详情
  {
    url: '/car-insurance',
    method: 'GET',
    response: (req) => {
      const u = new URL(req.url!, 'http://localhost')
      const id = parseInt(u.searchParams.get('id') || '0', 10)
      const item = data.find((d) => d.id === id)
      if (!item) return { code: 404, data: null, message: '未找到该投保记录' }
      return { code: 200, data: item, message: 'ok' }
    },
  },

  // 新增
  {
    url: '/car-insurance',
    method: 'POST',
    response: async (req) => {
      const body = await parseBody(req)
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      const item: CarInsurance = {
        id: idSeq++,
        plateNo: body.plateNo || '',
        ownerName: body.ownerName || '',
        ownerPhone: body.ownerPhone || '',
        carBrand: body.carBrand || '',
        carModel: body.carModel || '',
        carYear: Number(body.carYear) || 1,
        vin: body.vin || '',
        engineNo: body.engineNo || '',
        insuranceType: body.insuranceType || '交强险',
        insuranceStart: body.insuranceStart || '',
        insuranceEnd: body.insuranceEnd || '',
        deductible: Number(body.deductible) || 0,
        estimatedValue: Number(body.estimatedValue) || 0,
        driverLicenseFront: body.driverLicenseFront || '',
        driverLicenseBack: body.driverLicenseBack || '',
        carPhoto: body.carPhoto || '',
        status: '待审核',
        coverageArea: body.coverageArea || '',
        agreeTerms: body.agreeTerms === true || body.agreeTerms === 'true',
        notes: body.notes || '',
        createTime: now,
        updateTime: now,
      }
      data.unshift(item)
      return { code: 200, data: item, message: '投保成功' }
    },
  },

  // 编辑
  {
    url: '/car-insurance',
    method: 'PUT',
    response: async (req) => {
      const body = await parseBody(req)
      const id = Number(body.id)
      const idx = data.findIndex((d) => d.id === id)
      if (idx === -1) return { code: 404, data: null, message: '未找到该投保记录' }

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      const existing = data[idx]
      data[idx] = {
        ...existing,
        plateNo: body.plateNo ?? existing.plateNo,
        ownerName: body.ownerName ?? existing.ownerName,
        ownerPhone: body.ownerPhone ?? existing.ownerPhone,
        carBrand: body.carBrand ?? existing.carBrand,
        carModel: body.carModel ?? existing.carModel,
        carYear: body.carYear != null ? Number(body.carYear) : existing.carYear,
        vin: body.vin ?? existing.vin,
        engineNo: body.engineNo ?? existing.engineNo,
        insuranceType: body.insuranceType ?? existing.insuranceType,
        insuranceStart: body.insuranceStart ?? existing.insuranceStart,
        insuranceEnd: body.insuranceEnd ?? existing.insuranceEnd,
        deductible: body.deductible != null ? Number(body.deductible) : existing.deductible,
        estimatedValue: body.estimatedValue != null ? Number(body.estimatedValue) : existing.estimatedValue,
        driverLicenseFront: body.driverLicenseFront ?? existing.driverLicenseFront,
        driverLicenseBack: body.driverLicenseBack ?? existing.driverLicenseBack,
        carPhoto: body.carPhoto ?? existing.carPhoto,
        status: body.status ?? existing.status,
        coverageArea: body.coverageArea ?? existing.coverageArea,
        agreeTerms: body.agreeTerms != null ? (body.agreeTerms === true || body.agreeTerms === 'true') : existing.agreeTerms,
        notes: body.notes ?? existing.notes,
        updateTime: now,
      }
      return { code: 200, data: data[idx], message: '更新成功' }
    },
  },

  // 删除
  {
    url: '/car-insurance',
    method: 'DELETE',
    response: async (req) => {
      const body = await parseBody(req)
      const id = Number(body.id)
      const idx = data.findIndex((d) => d.id === id)
      if (idx === -1) return { code: 404, data: null, message: '未找到该投保记录' }
      data.splice(idx, 1)
      return { code: 200, data: null, message: '删除成功' }
    },
  },

  // 图片上传
  {
    url: '/car-insurance/upload',
    method: 'POST',
    response: async (req) => {
      try {
        const body = await parseBody(req)
        const { fileName, base64 } = body
        if (!base64) return { code: 400, data: null, message: '缺少文件数据' }

        const matches = base64.match(/^data:(image\/\w+);base64,(.+)$/)
        const ext = matches ? matches[1].split('/')[1] : 'png'
        const raw = matches ? matches[2] : base64

        const safeName = `ci-${uuid()}.${ext}`
        const filePath = path.join(uploadDir, safeName)

        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
        fs.writeFileSync(filePath, Buffer.from(raw, 'base64'))

        return { code: 200, data: { url: `/upload/${safeName}`, fileName: safeName }, message: '上传成功' }
      } catch (e) {
        return { code: 500, data: null, message: '上传失败' }
      }
    },
  },
]

/** 解析请求体（JSON） */
async function parseBody(req: any): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk: Buffer) => { raw += chunk.toString() })
    req.on('end', () => {
      try { resolve(JSON.parse(raw)) } catch { resolve({}) }
    })
  })
}

export default routes
