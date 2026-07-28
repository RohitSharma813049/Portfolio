/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { GET, POST } from '../route'
import Project from '@/models/Project'
import connectToDatabase from '@/lib/mongodb'

// Mock the dependencies
jest.mock('next/server', () => {
  return {
    NextRequest: class MockNextRequest {
      url: string;
      method: string;
      body: string;
      constructor(url: string, init?: any) {
        this.url = url;
        this.method = init?.method || 'GET';
        this.body = init?.body || '';
      }
      async json() {
        return JSON.parse(this.body);
      }
    },
    NextResponse: {
      json: jest.fn().mockImplementation((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body
        }
      })
    }
  }
})

jest.mock('@/lib/mongodb', () => jest.fn())
jest.mock('@/models/Project', () => ({
  find: jest.fn(),
  create: jest.fn(),
}))

describe('Projects API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/projects', () => {
    it('returns a list of projects successfully', async () => {
      const mockProjects = [
        { _id: '1', name: 'Project 1', status: 'PUBLISHED' },
        { _id: '2', name: 'Project 2', status: 'DRAFT' },
      ]

      // Setup the mock chain: Project.find().sort()
      const mockSort = jest.fn().mockResolvedValue(mockProjects)
      ;(Project.find as jest.Mock).mockReturnValue({ sort: mockSort })

      const req = new NextRequest('http://localhost:3000/api/projects')
      const res = await GET(req)
      const json = await res.json()

      expect(connectToDatabase).toHaveBeenCalled()
      expect(Project.find).toHaveBeenCalledWith({})
      expect(json.success).toBe(true)
      expect(json.data).toEqual(mockProjects)
    })
  })

  describe('POST /api/projects', () => {
    it('creates a new project and auto-generates slug', async () => {
      const mockBody = {
        name: 'New Test Project',
        shortDescription: 'Desc'
      }

      const mockCreatedProject = {
        _id: '123',
        name: 'New Test Project',
        slug: 'new-test-project',
        shortDescription: 'Desc'
      }

      ;(Project.create as jest.Mock).mockResolvedValue(mockCreatedProject)

      const req = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify(mockBody)
      })

      const res = await POST(req)
      const json = await res.json()

      expect(connectToDatabase).toHaveBeenCalled()
      expect(Project.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Test Project',
        slug: 'new-test-project' // Verify slug generation worked
      }))
      
      expect(res.status).toBe(201)
      expect(json.success).toBe(true)
      expect(json.data).toEqual(mockCreatedProject)
    })
  })
})
