import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { AuthProvider } from '../context/AuthContext';

describe('Top Navigation Bar & Branding Updates', () => {
  it('hides the "About Us" button when on the Landing Page ("/")', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/']}>
          <Navbar />
        </MemoryRouter>
      </AuthProvider>
    );

    // Brand logo should be present
    expect(screen.getByText('CertiShield AI')).toBeInTheDocument();

    // Subtext under logo should be gone
    expect(screen.queryByText(/About Us • Forensic Architecture/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Forensic Architecture/i)).not.toBeInTheDocument();

    // Dedicated "About Us" button in top nav should NOT be rendered on Landing page
    expect(screen.queryByTestId('nav-about-us-btn')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /About Us/i })).not.toBeInTheDocument();
  });

  it('renders the "About Us" button on non-landing sub-pages ("/verify")', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/verify']}>
          <Navbar />
        </MemoryRouter>
      </AuthProvider>
    );

    // "About Us" button should be visible
    const aboutUsBtn = screen.getByTestId('nav-about-us-btn');
    expect(aboutUsBtn).toBeInTheDocument();
    expect(aboutUsBtn).toHaveTextContent('About Us');
    expect(aboutUsBtn.getAttribute('href')).toBe('/');

    // Brand logo remains clean
    expect(screen.getByText('CertiShield AI')).toBeInTheDocument();
    expect(screen.queryByText(/Forensic Architecture/i)).not.toBeInTheDocument();

    // Login/Register action is placed after About Us
    expect(screen.getByText('Login / Register')).toBeInTheDocument();
  });

  it('renders the "About Us" button on other sub-pages like ("/history") and navigates back to ("/")', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/history']}>
          <Navbar />
          <Routes>
            <Route path="/history" element={<div>History Page Content</div>} />
            <Route path="/" element={<div>Landing Page Content</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    const aboutUsBtn = screen.getByTestId('nav-about-us-btn');
    expect(aboutUsBtn).toBeInTheDocument();

    // Click About Us
    fireEvent.click(aboutUsBtn);

    // Now on landing page, About Us button disappears from DOM
    expect(screen.getByText('Landing Page Content')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-about-us-btn')).not.toBeInTheDocument();
  });
});
