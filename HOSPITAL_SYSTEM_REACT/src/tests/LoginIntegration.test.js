import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/portalG/LoginPage';

describe('Login Integration Test', () => {
    it('should successfully login with valid credentials', async () => {
        // Render the login component
        const { getByLabelText, getByText } = render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        // Simulate user input
        fireEvent.change(getByLabelText(/correo/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(getByLabelText(/contraseña/i), {
            target: { value: '123456' }
        });

        // Simulate form submission
        fireEvent.click(getByText(/iniciar sesión/i));

        // Wait for and verify the response
        await waitFor(() => {
            expect(window.sessionStorage.getItem('rol')).toBe('admin');
        });
    });
});