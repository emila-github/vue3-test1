import type { MockRoute } from './types'

// ===== 字典数据 =====
const skillOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
  { label: 'Go', value: 'go' },
]

const cityTree = [
  {
    label: '北京市', value: '110000',
    children: [
      { label: '海淀区', value: '110108' },
      { label: '朝阳区', value: '110105' },
      { label: '西城区', value: '110102' },
      { label: '东城区', value: '110101' },
    ],
  },
  {
    label: '上海市', value: '310000',
    children: [
      { label: '浦东新区', value: '310115' },
      { label: '徐汇区', value: '310104' },
      { label: '静安区', value: '310106' },
      { label: '黄浦区', value: '310101' },
    ],
  },
  {
    label: '广东省', value: '440000',
    children: [
      {
        label: '深圳市', value: '440300',
        children: [
          { label: '南山区', value: '440305' },
          { label: '福田区', value: '440304' },
          { label: '宝安区', value: '440306' },
        ],
      },
      {
        label: '广州市', value: '440100',
        children: [
          { label: '天河区', value: '440106' },
          { label: '海珠区', value: '440105' },
        ],
      },
    ],
  },
  {
    label: '浙江省', value: '330000',
    children: [
      {
        label: '杭州市', value: '330100',
        children: [
          { label: '西湖区', value: '330106' },
          { label: '滨江区', value: '330108' },
          { label: '余杭区', value: '330110' },
        ],
      },
    ],
  },
  {
    label: '四川省', value: '510000',
    children: [
      {
        label: '成都市', value: '510100',
        children: [
          { label: '武侯区', value: '510107' },
          { label: '锦江区', value: '510104' },
          { label: '高新区', value: '510109' },
        ],
      },
    ],
  },
]

const orgTree = [
  {
    label: '总公司', value: 'root',
    children: [
      {
        label: '技术中心', value: 'tech',
        children: [
          { label: '前端研发部', value: 'tech-frontend' },
          { label: '后端研发部', value: 'tech-backend' },
          { label: '测试部', value: 'tech-qa' },
          { label: '运维部', value: 'tech-ops' },
        ],
      },
      {
        label: '产品中心', value: 'product',
        children: [
          { label: '产品设计部', value: 'product-design' },
          { label: '用户体验部', value: 'product-ux' },
        ],
      },
      {
        label: '市场中心', value: 'market',
        children: [
          { label: '市场推广部', value: 'market-promotion' },
          { label: '销售部', value: 'market-sales' },
        ],
      },
      { label: '人力资源部', value: 'hr' },
      { label: '财务部', value: 'finance' },
    ],
  },
]

const departmentOptions = [
  { label: '技术中心/前端研发部', value: 'tech-frontend' },
  { label: '技术中心/后端研发部', value: 'tech-backend' },
  { label: '技术中心/测试部', value: 'tech-qa' },
  { label: '技术中心/运维部', value: 'tech-ops' },
  { label: '产品中心/产品设计部', value: 'product-design' },
  { label: '产品中心/用户体验部', value: 'product-ux' },
  { label: '市场中心/市场推广部', value: 'market-promotion' },
  { label: '市场中心/销售部', value: 'market-sales' },
  { label: '人力资源部', value: 'hr' },
  { label: '财务部', value: 'finance' },
]

// ===== Mock 员工数据 =====
let employeeStore: any[] = [
  { id: 1, name: '张三', employeeNo: 'EMP001', gender: 'male', age: 28, department: 'tech-frontend', positions: ['vue', 'typescript'], city: ['440000', '440300', '440305'], orgPath: 'tech-frontend', salary: 18000, hireDate: '2024-03-15', status: 'active', isFullTime: true, email: 'zhangsan@example.com', phone: '13800138001', remark: '前端技术专家', createdAt: '2024-03-15 09:00:00' },
  { id: 2, name: '李四', employeeNo: 'EMP002', gender: 'female', age: 25, department: 'product-design', positions: ['react', 'nodejs'], city: ['440000', '440300', '440304'], orgPath: 'product-design', salary: 15000, hireDate: '2024-06-01', status: 'active', isFullTime: true, email: 'lisi@example.com', phone: '13800138002', remark: '', createdAt: '2024-06-01 09:00:00' },
  { id: 3, name: '王五', employeeNo: 'EMP003', gender: 'male', age: 32, department: 'tech-backend', positions: ['java', 'python'], city: ['310000', '310115'], orgPath: 'tech-backend', salary: 22000, hireDate: '2023-09-10', status: 'active', isFullTime: true, email: 'wangwu@example.com', phone: '13800138003', remark: '后端架构师', createdAt: '2023-09-10 09:00:00' },
  { id: 4, name: '赵六', employeeNo: 'EMP004', gender: 'female', age: 27, department: 'tech-frontend', positions: ['angular', 'typescript'], city: ['110000', '110108'], orgPath: 'tech-frontend', salary: 16000, hireDate: '2024-01-20', status: 'probation', isFullTime: true, email: 'zhaoliu@example.com', phone: '13800138004', remark: '实习转正中', createdAt: '2024-01-20 09:00:00' },
  { id: 5, name: '孙七', employeeNo: 'EMP005', gender: 'male', age: 35, department: 'tech-ops', positions: ['go', 'python'], city: ['440000', '440100', '440106'], orgPath: 'tech-ops', salary: 25000, hireDate: '2022-05-18', status: 'active', isFullTime: true, email: 'sunqi@example.com', phone: '13800138005', remark: '运维负责人', createdAt: '2022-05-18 09:00:00' },
  { id: 6, name: '周八', employeeNo: 'EMP006', gender: 'female', age: 29, department: 'market-sales', positions: ['typescript'], city: ['310000', '310104'], orgPath: 'market-sales', salary: 14000, hireDate: '2024-08-01', status: 'active', isFullTime: false, email: 'zhouba@example.com', phone: '13800138006', remark: '', createdAt: '2024-08-01 09:00:00' },
  { id: 7, name: '吴九', employeeNo: 'EMP007', gender: 'male', age: 31, department: 'tech-qa', positions: ['java', 'python', 'go'], city: ['330000', '330100', '330106'], orgPath: 'tech-qa', salary: 19000, hireDate: '2023-11-05', status: 'active', isFullTime: true, email: 'wujiu@example.com', phone: '13800138007', remark: '测试主管', createdAt: '2023-11-05 09:00:00' },
  { id: 8, name: '郑十', employeeNo: 'EMP008', gender: 'female', age: 26, department: 'product-ux', positions: ['vue', 'react'], city: ['110000', '110105'], orgPath: 'product-ux', salary: 13000, hireDate: '2025-02-10', status: 'probation', isFullTime: true, email: 'zhengshi@example.com', phone: '13800138008', remark: '', createdAt: '2025-02-10 09:00:00' },
  { id: 9, name: '钱十一', employeeNo: 'EMP009', gender: 'male', age: 38, department: 'finance', positions: ['java'], city: ['310000', '310106'], orgPath: 'finance', salary: 28000, hireDate: '2021-07-01', status: 'active', isFullTime: true, email: 'qian11@example.com', phone: '13800138009', remark: '财务总监', createdAt: '2021-07-01 09:00:00' },
  { id: 10, name: '冯十二', employeeNo: 'EMP010', gender: 'female', age: 24, department: 'hr', positions: ['vue'], city: ['510000', '510100', '510107'], orgPath: 'hr', salary: 12000, hireDate: '2025-04-01', status: 'probation', isFullTime: true, email: 'feng12@example.com', phone: '13800138010', remark: '', createdAt: '2025-04-01 09:00:00' },
  { id: 11, name: '陈十三', employeeNo: 'EMP011', gender: 'male', age: 30, department: 'tech-backend', positions: ['nodejs', 'typescript'], city: ['440000', '440300', '440306'], orgPath: 'tech-backend', salary: 21000, hireDate: '2023-06-20', status: 'active', isFullTime: true, email: 'chen13@example.com', phone: '13800138011', remark: '', createdAt: '2023-06-20 09:00:00' },
  { id: 12, name: '褚十四', employeeNo: 'EMP012', gender: 'female', age: 33, department: 'market-promotion', positions: ['python'], city: ['110000', '110102'], orgPath: 'market-promotion', salary: 17000, hireDate: '2024-09-15', status: 'inactive', isFullTime: true, email: 'chu14@example.com', phone: '13800138012', remark: '产假中', createdAt: '2024-09-15 09:00:00' },
  { id: 13, name: '卫十五', employeeNo: 'EMP013', gender: 'male', age: 27, department: 'tech-frontend', positions: ['vue', 'react', 'nodejs'], city: ['330000', '330100', '330108'], orgPath: 'tech-frontend', salary: 17500, hireDate: '2024-05-10', status: 'active', isFullTime: true, email: 'wei15@example.com', phone: '13800138013', remark: '全栈倾向', createdAt: '2024-05-10 09:00:00' },
  { id: 14, name: '蒋十六', employeeNo: 'EMP014', gender: 'female', age: 29, department: 'tech-qa', positions: ['python'], city: ['510000', '510100', '510109'], orgPath: 'tech-qa', salary: 15500, hireDate: '2024-11-01', status: 'active', isFullTime: true, email: 'jiang16@example.com', phone: '13800138014', remark: '', createdAt: '2024-11-01 09:00:00' },
  { id: 15, name: '沈十七', employeeNo: 'EMP015', gender: 'male', age: 40, department: 'tech-ops', positions: ['go'], city: ['310000', '310101'], orgPath: 'tech-ops', salary: 32000, hireDate: '2020-03-01', status: 'active', isFullTime: true, email: 'shen17@example.com', phone: '13800138015', remark: '架构总监', createdAt: '2020-03-01 09:00:00' },
]

let nextId = 16

function parseBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk: string) => { body += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(body)) } catch { resolve({}) }
    })
  })
}

const routes: MockRoute[] = [
  // ===== 字典接口 =====
  { url: '/employees/skills', method: 'GET', response: { code: 200, data: skillOptions, message: 'ok' } },
  { url: '/employees/cities', method: 'GET', response: { code: 200, data: cityTree, message: 'ok' } },
  { url: '/employees/org-tree', method: 'GET', response: { code: 200, data: orgTree, message: 'ok' } },
  { url: '/employees/departments', method: 'GET', response: { code: 200, data: departmentOptions, message: 'ok' } },

  // ===== 查询员工列表 =====
  {
    url: '/employees',
    method: 'GET',
    response: (req: any) => {
      const url = new URL(req.url, 'http://localhost')
      const keyword = url.searchParams.get('keyword')?.toLowerCase() || ''
      const status = url.searchParams.get('status') || ''
      const hireStart = url.searchParams.get('hireStart') || ''
      const hireEnd = url.searchParams.get('hireEnd') || ''
      const ageMin = Number(url.searchParams.get('ageMin')) || 0
      const ageMax = Number(url.searchParams.get('ageMax')) || 200
      const gender = url.searchParams.get('gender') || ''
      const department = url.searchParams.get('department') || ''
      const city = url.searchParams.get('city') || ''
      const isFullTime = url.searchParams.get('isFullTime')
      const page = Number(url.searchParams.get('page')) || 1
      const pageSize = Number(url.searchParams.get('pageSize')) || 10

      let list = [...employeeStore]

      if (keyword) {
        list = list.filter(
          (e) =>
            e.name.toLowerCase().includes(keyword) ||
            e.employeeNo.toLowerCase().includes(keyword) ||
            e.email.toLowerCase().includes(keyword) ||
            e.phone.includes(keyword),
        )
      }
      if (status) {
        const statusArr = status.split(',')
        list = list.filter((e) => statusArr.includes(e.status))
      }
      if (hireStart) {
        list = list.filter((e) => e.hireDate >= hireStart)
      }
      if (hireEnd) {
        list = list.filter((e) => e.hireDate <= hireEnd)
      }
      if (ageMin > 0) {
        list = list.filter((e) => e.age >= ageMin)
      }
      if (ageMax < 200) {
        list = list.filter((e) => e.age <= ageMax)
      }
      if (gender) {
        list = list.filter((e) => e.gender === gender)
      }
      if (department) {
        list = list.filter((e) => e.department === department)
      }
      if (city) {
        list = list.filter((e) => e.city && e.city.join(',') === city)
      }
      if (isFullTime !== null && isFullTime !== '') {
        list = list.filter((e) => e.isFullTime === (isFullTime === 'true'))
      }

      const total = list.length
      const start = (page - 1) * pageSize
      const paged = list.slice(start, start + pageSize)

      return { code: 200, data: { list: paged, total, page, pageSize }, message: 'ok' }
    },
  },

  // ===== 新增员工 =====
  {
    url: '/employees',
    method: 'POST',
    response: async (req: any) => {
      const body = await parseBody(req)
      const employee = {
        id: nextId++,
        ...body,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      employeeStore.push(employee)
      return { code: 200, data: employee, message: '创建成功' }
    },
  },

  // ===== 更新员工 =====
  {
    url: '/employees',
    method: 'PUT',
    response: async (req: any) => {
      const body = await parseBody(req)
      const id = Number(req.url?.split('/').pop()?.split('?')[0]) || body.id
      const idx = employeeStore.findIndex((e) => e.id === id)
      if (idx === -1) return { code: 404, data: null, message: '记录不存在' }
      employeeStore[idx] = { ...employeeStore[idx], ...body, id }
      return { code: 200, data: employeeStore[idx], message: '更新成功' }
    },
  },

  // ===== 删除员工 =====
  {
    url: '/employees',
    method: 'DELETE',
    response: async (req: any) => {
      const urlStr = req.url || ''
      // 批量删除
      if (urlStr.includes('/employees/batch')) {
        const body = await parseBody(req)
        const ids: number[] = body.ids || []
        employeeStore = employeeStore.filter((e) => !ids.includes(e.id))
        return { code: 200, data: null, message: `已删除 ${ids.length} 条记录` }
      }
      // 单个删除
      const id = Number(urlStr.split('/').pop()?.split('?')[0])
      employeeStore = employeeStore.filter((e) => e.id !== id)
      return { code: 200, data: null, message: '删除成功' }
    },
  },
]

export default routes
