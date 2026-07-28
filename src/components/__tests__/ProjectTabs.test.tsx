import { render, screen, fireEvent } from '@testing-library/react'
import ProjectTabs from '../ProjectTabs'

const mockProject = {
  name: "Test Project",
  fullDescription: "This is a full description of the test project.",
  features: [
    { title: "Feature 1", description: "Desc 1" }
  ],
  panels: [
    { name: "Admin Panel", description: "Admin panel desc" }
  ],
  screenshots: [
    { url: "https://example.com/shot1.png", type: "DESKTOP" }
  ]
}

describe('ProjectTabs Component', () => {
  it('renders the Overview tab by default', () => {
    render(<ProjectTabs project={mockProject} />)
    
    // Check if the detailed description from overview is present
    expect(screen.getByText('Detailed Description')).toBeInTheDocument()
    expect(screen.getByText(mockProject.fullDescription)).toBeInTheDocument()
    
    // Check if Features are NOT visible yet
    expect(screen.queryByText('Feature 1')).not.toBeInTheDocument()
  })

  it('switches to the Features tab when clicked', () => {
    render(<ProjectTabs project={mockProject} />)
    
    // Click the Features tab
    fireEvent.click(screen.getByText('Features', { selector: 'button' }))
    
    // Now features should be visible
    expect(screen.getByText('Key Features')).toBeInTheDocument()
    expect(screen.getByText('Feature 1')).toBeInTheDocument()
    expect(screen.getByText('Desc 1')).toBeInTheDocument()
    
    // Overview should be hidden
    expect(screen.queryByText('Detailed Description')).not.toBeInTheDocument()
  })

  it('switches to the Panels tab when clicked', () => {
    render(<ProjectTabs project={mockProject} />)
    
    // Click the Panels tab
    fireEvent.click(screen.getByText('Panels', { selector: 'button' }))
    
    // Now panels should be visible
    expect(screen.getByText('Included Panels')).toBeInTheDocument()
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })
})
