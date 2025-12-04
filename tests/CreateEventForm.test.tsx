// __tests__/CreateEventForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateEventForm } from '../app/components/CreateEventForm'

describe('CreateEventForm', () => {
  const originalAlert = window.alert
  
  beforeEach(() => {
    window.alert = jest.fn()
  }) 

  afterEach(() => {
    window.alert = originalAlert
    jest.clearAllMocks()
  })

  test('renders basic form structure', () => {
    render(<CreateEventForm />)
    
    expect(screen.getByText('Create New Event')).toBeInTheDocument()
    expect(screen.getByText(/Share your leftover food/)).toBeInTheDocument()
    
    expect(screen.getByText('Event Information')).toBeInTheDocument()
    expect(screen.getByText('Food Details')).toBeInTheDocument()
    expect(screen.getByText('Event Image')).toBeInTheDocument()
  })

  test('handles food item addition and removal', async () => {
    render(<CreateEventForm />)
    const user = userEvent.setup()
    
    const foodInput = screen.getByPlaceholderText('Add food item (e.g., Pizza, Sandwiches)')
    const addButton = screen.getByText('Add')
    
    await user.type(foodInput, 'Pizza')
    await user.click(addButton)
    
    const pizzaElement = await screen.findByText('Pizza')
    expect(pizzaElement).toBeInTheDocument()
    
    const removeButton = screen.getByLabelText('remove Pizza')
    await user.click(removeButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Pizza')).not.toBeInTheDocument()
    })
  })

  test('toggles dietary preference checkboxes', async () => {
    render(<CreateEventForm />)
    const user = userEvent.setup()
    
    const vegetarianCheckbox = screen.getByLabelText('Vegetarian')
    const veganCheckbox = screen.getByLabelText('Vegan')
    
    expect(vegetarianCheckbox).not.toBeChecked()
    expect(veganCheckbox).not.toBeChecked()
    
    await user.click(vegetarianCheckbox)
    await user.click(veganCheckbox)
    
    expect(vegetarianCheckbox).toBeChecked()
    expect(veganCheckbox).toBeChecked()
    
    await user.click(vegetarianCheckbox)
    expect(vegetarianCheckbox).not.toBeChecked()
  })

  test('validates form input fields', async () => {
    render(<CreateEventForm />)
    const user = userEvent.setup()
    
    const nameInput = screen.getByLabelText(/Event Name \*/i)
    const descriptionInput = screen.getByLabelText(/Description \*/i)
    
    await user.type(nameInput, 'Test Event Name')
    await user.type(descriptionInput, 'Test description for the event')
    
    expect(nameInput).toHaveValue('Test Event Name')
    expect(descriptionInput).toHaveValue('Test description for the event')
  })

  test('submit and cancel buttons are present', () => {
    render(<CreateEventForm />)
    
    const submitButton = screen.getByText('Create Event')
    const cancelButton = screen.getByText('Cancel')
    
    expect(submitButton).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
    expect(submitButton).not.toHaveAttribute('disabled')
  })
})