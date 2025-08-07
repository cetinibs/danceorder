import { createMocks } from 'node-mocks-http'
import { POST, GET } from '@/app/api/packages/route'
import { getServerSession } from '@/lib/auth'

jest.mock('@/lib/auth')
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('Packages API', () => {
  beforeEach(() => {
    mockGetServerSession.mockResolvedValue({
      user: { id: '1', name: 'Admin', role: 'admin' }
    })
  })

  describe('POST /api/packages', () => {
    it('should add a package to student', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          studentId: '123',
          packageName: 'Bireysel Pilates 8 Saat',
          totalHours: 8,
          price: 2000
        }
      })

      await POST(req)
      const data = JSON.parse(res._getData())

      expect(res._getStatusCode()).toBe(200)
      expect(data.success).toBe(true)
      expect(data.package.remainingHours).toBe(8)
    })

    it('should validate package hours', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          studentId: '123',
          packageName: 'Invalid Package',
          totalHours: 7, // Invalid hours
          price: 2000
        }
      })

      await POST(req)
      const data = JSON.parse(res._getData())

      expect(res._getStatusCode()).toBe(400)
      expect(data.error).toContain('Geçersiz paket saati')
    })
  })
}) 