import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/portalG/LoginPage';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('LoginPage Integration Tests', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        sessionStorage.clear();
    });

    it('should handle successful admin login', async () => {
        const mockResponse = {
            success: true,
            usuario: {
                id: 1,
                correo: 'admin@test.com',
                rol: 'admin'
            }
        };

        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockResponse)
        });

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/correo/i), {
            target: { value: 'admin@test.com' }
        });
        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: 'password123' }
        });
        fireEvent.click(screen.getByText(/iniciar sesión/i));

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/admin');
            expect(sessionStorage.getItem('rol')).toBe('admin');
        });
    });

    it('should display error message on failed login', async () => {
        const mockResponse = {
            success: false,
            message: 'Contraseña incorrecta'
        };

        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockResponse)
        });

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/correo/i), {
            target: { value: 'user@test.com' }
        });
        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: 'wrongpassword' }
        });
        fireEvent.click(screen.getByText(/iniciar sesión/i));

        await waitFor(() => {
            expect(screen.getByText('Contraseña incorrecta')).toBeInTheDocument();
        });
    });

    it('should handle network errors', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/correo/i), {
            target: { value: 'test@test.com' }
        });
        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: 'password' }
        });
        fireEvent.click(screen.getByText(/iniciar sesión/i));

        await waitFor(() => {
            expect(screen.getByText('Error de servidor. Intenta más tarde.')).toBeInTheDocument();
        });
    });
});