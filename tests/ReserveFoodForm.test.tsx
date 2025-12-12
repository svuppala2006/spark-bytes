// __tests__/ReserveFoodForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReserveFoodForm } from '../app/components/ReserveFoodForm'

describe('ReserveFoodForm', () => {
  const mockEvent = {
    id: 1,
    name: 'Test Event',
    location: 'Test Location',
    foodItems: ['Pizza', 'Sandwiches', 'Salad'],
    availablePortions: 10
  }

  beforeEach(() => {
    window.alert = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('renders reservation form with event details', () => {
    render(<ReserveFoodForm event={mockEvent} />)
    
    expect(screen.getByText('Reserve Food')).toBeInTheDocument()
    expect(screen.getByText(mockEvent.name)).toBeInTheDocument()
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument()
    
    mockEvent.foodItems.forEach(item => {
      expect(screen.getByLabelText(item)).toBeInTheDocument()
    })
    
    expect(screen.getByLabelText(/Number of Portions/i)).toBeInTheDocument()
    expect(screen.getByText(`Maximum ${mockEvent.availablePortions} portions available`)).toBeInTheDocument()
    expect(screen.getByText('Confirm Reservation')).toBeInTheDocument()
  })

  test('enables reserve button when food is selected', async () => {
    render(<ReserveFoodForm event={mockEvent} />)
    const user = userEvent.setup()
    
    const reserveButton = screen.getByText('Confirm Reservation')
    const pizzaCheckbox = screen.getByLabelText('Pizza')
    
    expect(reserveButton).toBeDisabled()
    
    await user.click(pizzaCheckbox)
    expect(reserveButton).not.toBeDisabled()
  })

  test('allows food item selection', async () => {
    render(<ReserveFoodForm event={mockEvent} />)
    const user = userEvent.setup()
    
    const pizzaCheckbox = screen.getByLabelText('Pizza')
    const saladCheckbox = screen.getByLabelText('Salad')
    
    expect(pizzaCheckbox).not.toBeChecked()
    expect(saladCheckbox).not.toBeChecked()
    
    await user.click(pizzaCheckbox)
    expect(pizzaCheckbox).toBeChecked()
    
    await user.click(saladCheckbox)
    expect(saladCheckbox).toBeChecked()
    
    await user.click(pizzaCheckbox)
    expect(pizzaCheckbox).not.toBeChecked()
  })
})