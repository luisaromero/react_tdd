import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { Form } from './Form'


describe('when the form is mounted', () => {
    beforeEach(() => render(<Form />))

    it('there must be a create product form page', () => {

        expect(screen.getByRole('heading', { name: /create product/i })).toBeInTheDocument()
    })
    it('should exist the fields: name, size, type (electronic,furniture, clothing)', () => {
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/size/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/type/i)).toBeInTheDocument()

        expect(screen.queryByText(/electronic/i)).toBeInTheDocument()
        expect(screen.queryByText(/furniture/i)).toBeInTheDocument()
        expect(screen.queryByText(/clothing/i)).toBeInTheDocument()

    })

    it('should exist the submit button', () => {
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()

    })
})

describe('when the form is mounted', () => {
    beforeEach(() => render(<Form />))

    it('when the user submits the form without values', () => {

        fireEvent.click(screen.getByRole('button', { name: /submit/i }))
        expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()

    })
})

