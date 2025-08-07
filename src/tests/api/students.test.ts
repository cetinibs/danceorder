import { createMocks } from 'node-mocks-http'
import { POST, GET, PUT, DELETE } from '@/app/api/students/route'
import { getServerSession } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

jest.mock('@/lib/auth')
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('Students API', () => {
  beforeEach(() => {
    mockGetServerSession.mockResolvedValue({
      user: { id: '1', name: 'Admin', role: 'admin' }
    })
  })

  describe('POST /api/students', () => {
    it('should create a new student', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test Student',
          email: 'test@example.com',
          phone: '5551234567',
          emergencyContactName: 'Emergency Contact',
          emergencyContactPhone: '5559876543'
        }
      })

      await POST(req)
      const data = JSON.parse(res._getData())

      expect(res._getStatusCode()).toBe(200)
      expect(data.success).toBe(true)
      expect(data.student).toHaveProperty('id')
      expect(data.student.name).toBe('Test Student')
    })

    it('should validate required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test Student'
          // email and phone missing
        }
      })

      await POST(req)
      const data = JSON.parse(res._getData())

      expect(res._getStatusCode()).toBe(400)
      expect(data.error).toBe('Ad, e-posta ve telefon zorunludur')
    })
  })

  describe('GET /api/students', () => {
    it('should return all students', async () => {
      // First create a test student
      const { req: postReq } = createMocks({
        method: 'POST',
        body: {
          name: 'Test Student',
          email: 'test@example.com',
          phone: '5551234567'
        }
      })
      await POST(postReq)

      // Then get all students
      const { req: getReq, res } = createMocks({ method: 'GET' })
      await GET(getReq)
      const data = JSON.parse(res._getData())

      expect(res._getStatusCode()).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.students)).toBe(true)
      expect(data.students.length).toBeGreaterThan(0)
    })
  })

  describe('PUT /api/students', () => {
    it('should update an existing student', async () => {
      // First create a test student
      const { req: postReq } = createMocks({
        method: 'POST',
        body: {
          name: 'Test Student',
          email: 'test@example.com',
          phone: '5551234567'
        }
      })
      const postRes = await POST(postReq)
      const postData = JSON.parse(postRes._getData())
      const studentId = postData.student.id

      // Then update the student
      const { req: putReq, res } = createMocks({
        method: 'PUT',
        body: {
          id: studentId,
          name: 'Updated Name',
          email: 'updated@example.com',
          phone: '5559876543'
        }
      })

      await PUT(putReq)
      const data = JSON.parse(res._getData())

      expect(res._getStatusCode()).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('DELETE /api/students', () => {
    it('should delete a student', async () => {
      // First create a test student
      const { req: postReq } = createMocks({
        method: 'POST',
        body: {
          name: 'Test Student',
          email: 'test@example.com',
          phone: '5551234567'
        }
      })
      const postRes = await POST(postReq)
      const postData = JSON.parse(postRes._getData())
      const studentId = postData.student.id

      // Then delete the student
      const { req: deleteReq, res } = createMocks({
        method: 'DELETE',
        url: `/api/students?id=${studentId}`
      })

      await DELETE(deleteReq)
      const data = JSON.parse(res._getData())

      expect(res._getStatusCode()).toBe(200)
      expect(data.success).toBe(true)
    })
  })
}) 