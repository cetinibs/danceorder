import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentForm from '../StudentForm'

describe('StudentForm', () => {
  const mockOnSuccess = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form fields correctly', () => {
    render(<StudentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

    expect(screen.getByLabelText(/Ad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Soyad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/E-posta/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Telefon/i)).toBeInTheDocument()
  })

  it('fills form with initial data', () => {
    const initialData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890'
    }

    render(
      <StudentForm 
        onSuccess={mockOnSuccess} 
        onCancel={mockOnCancel}
        initialData={initialData}
      />
    )

    expect(screen.getByLabelText(/Ad/i)).toHaveValue(initialData.firstName)
    expect(screen.getByLabelText(/Soyad/i)).toHaveValue(initialData.lastName)
    expect(screen.getByLabelText(/E-posta/i)).toHaveValue(initialData.email)
    expect(screen.getByLabelText(/Telefon/i)).toHaveValue(initialData.phone)
  })

  it('submits form data correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    ) as jest.Mock

    render(<StudentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

    await userEvent.type(screen.getByLabelText(/Ad/i), 'John')
    await userEvent.type(screen.getByLabelText(/Soyad/i), 'Doe')
    await userEvent.type(screen.getByLabelText(/E-posta/i), 'john@example.com')
    await userEvent.type(screen.getByLabelText(/Telefon/i), '1234567890')

    fireEvent.click(screen.getByRole('button', { name: /kaydet/i }))

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('handles form submission errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Bir hata oluştu' })
      })
    ) as jest.Mock

    render(<StudentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)

    fireEvent.click(screen.getByRole('button', { name: /kaydet/i }))

    await waitFor(() => {
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })
}) 