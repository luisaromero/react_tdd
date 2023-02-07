import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { Form } from './Form'

beforeEach(() => render(<Form />))


describe('when the form is mounted', () => {

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
    it('when the user submits the form without values', () => {

        expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: /submit/i }))

        expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()



    })
})

describe('when the user blurs an empty field', () => {
    it('should display a validation error message', () => {
        expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
        fireEvent.blur(screen.getByLabelText(/name/i), { target: { name: "name", value: "" } })
        expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    })

    it('should display a validation size error message', () => {
        expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()
        fireEvent.blur(screen.getByLabelText(/size/i), { target: { name: "size", value: "" } })
        expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
    }

    )
})

describe('when the user submit the form', () => {
    it('should the submit button be disabled until the request is done', () => {
        expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled()
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))
        expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
    })
})
