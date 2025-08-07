import { NextRequest } from 'next/server'
import { PUT, DELETE } from '../[id]/route'
import { getServerSession } from 'next-auth'
import { isValidObjectId } from 'mongoose'
import Student from '@/models/Student'

jest.mock('next-auth')
jest.mock('mongoose')
jest.mock('@/models/Student')
jest.mock('@/lib/dbConnect', () => jest.fn())

describe('Student API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('PUT /api/students/[id]', () => {
    it('updates student successfully', async () => {
      const mockSession = { user: { email: 'test@example.com' } }
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(isValidObjectId as jest.Mock).mockReturnValue(true)

      const mockStudent = {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe'
      }

      ;(Student.findById as jest.Mock).mockResolvedValue(mockStudent)
      ;(Student.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockStudent)

      const request = new NextRequest('http://localhost:3000/api/students/123', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe'
        })
      })

      const response = await PUT(request, { params: { id: '123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.student).toEqual(mockStudent)
    })

    it('returns 401 when not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/students/123', {
        method: 'PUT'
      })

      const response = await PUT(request, { params: { id: '123' } })
      
      expect(response.status).toBe(401)
    })
  })

  describe('DELETE /api/students/[id]', () => {
    it('deactivates student successfully', async () => {
      const mockSession = { user: { email: 'test@example.com' } }
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(isValidObjectId as jest.Mock).mockReturnValue(true)

      const mockStudent = {
        _id: '123',
        isActive: true
      }

      ;(Student.findById as jest.Mock).mockResolvedValue(mockStudent)
      ;(Student.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockStudent,
        isActive: false
      })

      const request = new NextRequest('http://localhost:3000/api/students/123', {
        method: 'DELETE'
      })

      const response = await DELETE(request, { params: { id: '123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
}) 