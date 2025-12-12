import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/app/components/ui/button'

// This is like a pytest test function - function name starts with 'test'
// In Jest, you use describe() to group tests and it() for individual tests
describe('Button Component', () => {

  // Test 1: Basic rendering
  // Similar to: def test_button_renders(client):
  it('renders button with text', () => {
    // Arrange: Set up the component
    render(<Button>Click me</Button>)

    // Act & Assert: Find the button and check it exists
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  // Test 2: Click handling
  it('calls onClick handler when clicked', async () => {
    // Arrange: Create a mock function (like unittest.mock in Python)
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    // Act: Click the button
    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    // Assert: Check the function was called once
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Test 3: Default variant styling
  it('applies default variant styles', () => {
    render(<Button variant="default">Default Button</Button>)
    const button = screen.getByRole('button')

    // Check that default styling classes are applied
    expect(button).toHaveClass('bg-red-600')
    expect(button).toHaveClass('text-white')
  })

  // Test 4: Outline variant styling
  it('applies outline variant styles', () => {
    render(<Button variant="outline">Outline Button</Button>)
    const button = screen.getByRole('button')

    // Check outline styling
    expect(button).toHaveClass('border')
    expect(button).toHaveClass('border-gray-300')
  })

  // Test 5: Size variations
  it('applies correct size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('px-3')
    expect(button).toHaveClass('py-1')

    // Rerender with different size (like running another test case)
    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('px-6')
    expect(button).toHaveClass('py-3')
  })

  // Test 6: Custom className prop
  it('accepts and applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  // Test 7: Disabled state
  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
