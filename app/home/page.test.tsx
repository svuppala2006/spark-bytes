import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from './page'; 
import { getAllEvents, getDashboardStats } from '@/lib/api';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/api', () => ({
  getAllEvents: jest.fn(),
  getDashboardStats: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Home Page', () => {
  const mockPush = jest.fn();

  const mockStats = {
    total_events: 100,
    total_food_saved: 500,
    active_users: 200,
    total_pounds_rescued: 1000,
  };

  const mockEvents = [
    {
      id: 1,
      name: 'Free Pizza',
      location: 'GSU Basement',
      food: ['Pizza', 'Soda'],
      start_time: '12:00 PM',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  // test1: renders the statement and buttons
  it('renders the mission statement and buttons', async () => {
    (getAllEvents as jest.Mock).mockResolvedValue([]);
    (getDashboardStats as jest.Mock).mockResolvedValue(mockStats);

    render(<Page />);

    expect(screen.getByText('Our Mission!')).toBeInTheDocument();
    
    // find button
    expect(screen.getByRole('button', { name: /browse events/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();

    // wait for loading
    await waitFor(() => {
      expect(screen.queryByText('Loading events...')).not.toBeInTheDocument();
    });
  });

  //test 2: displays stats and featured events
  it('fetches and displays stats and featured events', async () => {
    (getDashboardStats as jest.Mock).mockResolvedValue(mockStats);
    (getAllEvents as jest.Mock).mockResolvedValue(mockEvents);

    render(<Page />);

    expect(screen.getByText('Loading events...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('100+')).toBeInTheDocument(); 
      expect(screen.getByText('500+')).toBeInTheDocument(); 
    });

    await waitFor(() => {
      expect(screen.getByText('Free Pizza')).toBeInTheDocument();
      expect(screen.getByText(/GSU Basement/i)).toBeInTheDocument();
    });
  });

  // test 3: button availability
  it('navigates to search page when clicking Browse Events', async () => {
    (getAllEvents as jest.Mock).mockResolvedValue([]);
    (getDashboardStats as jest.Mock).mockResolvedValue(mockStats);

    render(<Page />);

    const browseButton = screen.getByRole('button', { name: /browse events/i });
    fireEvent.click(browseButton);

    expect(mockPush).toHaveBeenCalledWith('/search');

    await waitFor(() => {
      expect(screen.queryByText('Loading events...')).not.toBeInTheDocument();
    });
  });

  //test 4: errors
  it('displays error message when API fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (getAllEvents as jest.Mock).mockRejectedValue(new Error('API Error'));
    (getDashboardStats as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load dashboard data. Please try again later.')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });
});