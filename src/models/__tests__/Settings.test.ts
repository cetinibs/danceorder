import mongoose from 'mongoose'
import Settings from '../Settings'

describe('Settings Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI!)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    await Settings.deleteMany({})
  })

  it('creates general settings successfully', async () => {
    const settingsData = {
      type: 'general',
      companyName: 'Test Company',
      email: 'test@example.com',
      phone: '1234567890'
    }

    const settings = await Settings.create(settingsData)

    expect(settings.type).toBe('general')
    expect(settings.companyName).toBe('Test Company')
    expect(settings.email).toBe('test@example.com')
    expect(settings.phone).toBe('1234567890')
  })

  it('enforces unique type constraint', async () => {
    const settingsData = {
      type: 'general',
      companyName: 'Test Company'
    }

    await Settings.create(settingsData)

    await expect(Settings.create(settingsData)).rejects.toThrow()
  })

  it('uses default values correctly', async () => {
    const settings = await Settings.create({
      type: 'general',
      companyName: 'Test Company'
    })

    expect(settings.currency).toBe('TRY')
    expect(settings.timezone).toBe('Europe/Istanbul')
    expect(settings.language).toBe('tr')
  })
}) 