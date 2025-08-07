import { createMocks } from 'node-mocks-http'
import { POST as createStudent } from '@/app/api/students/route'
import { POST as addPackage } from '@/app/api/packages/route'
import { POST as addAppointment } from '@/app/api/appointments/route'
import { getServerSession } from '@/lib/auth'

jest.mock('@/lib/auth')
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('Student Package Integration', () => {
  beforeEach(() => {
    mockGetServerSession.mockResolvedValue({
      user: { id: '1', name: 'Admin', role: 'admin' }
    })
  })

  it('should handle complete student package flow', async () => {
    // 1. Create student
    const { req: studentReq } = createMocks({
      method: 'POST',
      body: {
        name: 'Test Student',
        email: 'test@example.com',
        phone: '5551234567'
      }
    })
    const studentRes = await createStudent(studentReq)
    const studentData = JSON.parse(studentRes._getData())
    const studentId = studentData.student.id

    // 2. Add package to student
    const { req: packageReq } = createMocks({
      method: 'POST',
      body: {
        studentId,
        packageName: 'Bireysel Pilates 8 Saat',
        totalHours: 8,
        price: 2000
      }
    })
    const packageRes = await addPackage(packageReq)
    const packageData = JSON.parse(packageRes._getData())

    expect(packageData.success).toBe(true)
    expect(packageData.package.remainingHours).toBe(8)

    // 3. Add appointment
    const { req: appointmentReq } = createMocks({
      method: 'POST',
      body: {
        studentId,
        teacherId: '1',
        date: '2024-03-20',
        startTime: '10:00',
        duration: 1
      }
    })
    const appointmentRes = await addAppointment(appointmentReq)
    const appointmentData = JSON.parse(appointmentRes._getData())

    expect(appointmentData.success).toBe(true)
    
    // 4. Verify remaining hours
    expect(packageData.package.remainingHours).toBe(7)
  })
}) 