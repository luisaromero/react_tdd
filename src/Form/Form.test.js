import React from 'react';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { Form } from './Form';
import { CREATED_STATUS, ERROR_SERVER_STATUS } from '../consts/httpStatus';


const server = setupServer(
    // Describe network behavior with request handlers.
    // Tip: move the handlers into their own module and
    // import it across your browser and Node.js setups!
    rest.post('/products', (req, res, ctx) => {
        const { name, size, type } = req.body
        if (name && size && type) {
            return res(ctx.status(CREATED_STATUS))
        }
        return res(ctx.status(ERROR_SERVER_STATUS))
    }),
)

// Enable request interception.
beforeAll(() => server.listen())

// Don't forget to clean up afterwards.
afterAll(() => server.close())




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

describe('when the user submit the form properly and the server returns created status', () => {
    it('should the submit button be disabled until the request is done', async () => {
        const submitBtn = screen.getByRole('button', { name: /submit/i })
        expect(submitBtn).not.toBeDisabled()
        fireEvent.click(submitBtn)
        expect(submitBtn).toBeDisabled()
        await waitFor(() =>
            expect(submitBtn).not.toBeDisabled()

        )
    })

    it('the form page must display the success message "Product stored" and clean fields values', async () => {
        const nameInput = screen.getByLabelText(/name/i)
        const sizeInput = screen.getByLabelText(/size/i)
        const typeSelect = screen.getByLabelText(/type/i)

        fireEvent.change(nameInput, { target: { name: "name", value: 'my product' } })
        fireEvent.change(sizeInput, { target: { name: "size", value: '10' } })
        fireEvent.change(typeSelect, { target: { name: "type", value: 'electronic' } })


        fireEvent.click(screen.getByRole('button', { name: /submit/i }))
        await waitFor(() => expect(screen.getByText(/product stored/i)).toBeInTheDocument())

        expect(nameInput).toHaveValue('')
        expect(sizeInput).toHaveValue('')
        expect(typeSelect).toHaveValue('')

    })
})

describe('when the user submit the form and the server returns unexpected error', () => {
    it('the form page must display the error message _“Unexpected error, please try again”', async () => {
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))
        await waitFor(() => expect(screen.getByText(/Unexpected error, please try again/i)).toBeInTheDocument())

    })
})
