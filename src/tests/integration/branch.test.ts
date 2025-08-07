import { createMocks } from 'node-mocks-http'
import { POST as createBranch, PUT as updateBranch } from '@/app/api/branches/route'
import { POST as addTeacher } from '@/app/api/branches/[branchId]/teachers/route'
import { POST as addStudent } from '@/app/api/branches/[branchId]/students/route'
import { POST as addSchedule } from '@/app/api/branches/[branchId]/schedule/route'
import { getServerSession } from '@/lib/auth'

jest.mock('@/lib/auth')
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('Branch Integration', () => {
  beforeEach(() => {
    mockGetServerSession.mockResolvedValue({
      user: { id: '1', name: 'Admin', role: 'admin' }
    })
  })

  it('should handle complete branch management flow', async () => {
    // 1. Create branch
    const { req: branchReq } = createMocks({
      method: 'POST',
      body: {
        name: 'Test Branch',
        address: 'Test Address',
        phone: '5551234567',
        email: 'branch@test.com',
        managerName: 'Test Manager',
        rooms: [
          {
            name: 'Room 1',
            capacity: 3,
            deviceCount: 3
          },
          {
            name: 'Room 2',
            capacity: 2,
            deviceCount: 2
          }
        ]
      }
    })

    const branchRes = await createBranch(branchReq)
    const branchData = JSON.parse(branchRes._getData())
    const branchId = branchData.branch.id

    expect(branchData.success).toBe(true)
    expect(branchData.branch.rooms.length).toBe(2)

    // 2. Add teacher
    const { req: teacherReq } = createMocks({
      method: 'POST',
      body: {
        name: 'Test Teacher',
        email: 'teacher@test.com',
        phone: '5559876543',
        specialties: ['pilates', 'yoga'],
        color: '#FF5733'
      },
      query: {
        branchId
      }
    })

    const teacherRes = await addTeacher(teacherReq)
    const teacherData = JSON.parse(teacherRes._getData())
    const teacherId = teacherData.teacher.id

    expect(teacherData.success).toBe(true)

    // 3. Add student with package
    const { req: studentReq } = createMocks({
      method: 'POST',
      body: {
        name: 'Test Student',
        email: 'student@test.com',
        phone: '5557891234',
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '5554567890'
        },
        healthInfo: 'No issues',
        package: {
          name: 'Bireysel Pilates 8 Saat',
          totalHours: 8,
          price: 2000,
          teacherId
        }
      },
      query: {
        branchId
      }
    })

    const studentRes = await addStudent(studentReq)
    const studentData = JSON.parse(studentRes._getData())
    const studentId = studentData.student.id

    expect(studentData.success).toBe(true)
    expect(studentData.student.packages.length).toBe(1)

    // 4. Add schedule
    const { req: scheduleReq } = createMocks({
      method: 'POST',
      body: {
        studentId,
        teacherId,
        roomId: branchData.branch.rooms[0].id,
        packageId: studentData.student.packages[0].id,
        date: '2024-03-20',
        startTime: '10:00',
        endTime: '11:00'
      },
      query: {
        branchId
      }
    })

    const scheduleRes = await addSchedule(scheduleReq)
    const scheduleData = JSON.parse(scheduleRes._getData())

    expect(scheduleData.success).toBe(true)

    // 5. Verify branch data
    const { req: getBranchReq } = createMocks({
      method: 'GET',
      query: {
        id: branchId
      }
    })

    const updatedBranchRes = await updateBranch(getBranchReq)
    const updatedBranchData = JSON.parse(updatedBranchRes._getData())

    expect(updatedBranchData.branch.teachers.length).toBe(1)
    expect(updatedBranchData.branch.students.length).toBe(1)
    expect(updatedBranchData.branch.schedule.length).toBe(1)
    expect(updatedBranchData.branch.finances.income.length).toBe(1)
  })
}) 