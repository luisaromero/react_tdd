import React, { useState } from 'react';
import { TextField, InputLabel, Select, Button, Container, CssBaseline, Grid, Typography } from '@mui/material';
import { saveProduct } from '../services/producServices';
import { CREATED_STATUS, ERROR_SERVER_STATUS, INVALID_REQUEST_STATUS } from '../consts/httpStatus';


export const Form = () => {

    const [formErrors, setFormErrors] = useState({
        name: "",
        size: "",
        type: ""
    })

    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const validateField = ({ name, value }) => {
        setFormErrors(prevState => ({ ...prevState, [name]: value.length ? "" : `The ${name} is required` }))
    }

    const validateForm = ({ name, size, type }) => {
        validateField({ name: "name", value: name })
        validateField({ name: "size", value: size })
        validateField({ name: "type", value: type })
    }

    const getFormValues = ({ name, size, type }) => ({
        name: name.value,
        size: size.value,
        type: type.value,
    })

    const handleFetchErrors = async (err) => {

        if (err.status === ERROR_SERVER_STATUS) {
            setErrorMessage('Unexpected error, please try again');
            return
        }
        if (err.status === INVALID_REQUEST_STATUS) {
            const data = await err.json()
            setErrorMessage(data.message);
            return
        }
        setErrorMessage('Connection error, please try later')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSaving(true)

        const { name, size, type } = e.target.elements;

        validateForm(getFormValues({ name, size, type }))

        try {
            const response = await saveProduct(getFormValues({ name, size, type }))
            if (!response.ok) {
                throw response
            }

            if (response.status === CREATED_STATUS) {
                e.target.reset()
                setIsSuccess(true);
            }
        }

        catch (err) {
            handleFetchErrors(err)
        }


        setIsSaving(false)

    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        validateField({ name, value })
    }

    return (
        <Container maxWidth="xs">
            <CssBaseline />
            <Typography component="h1" variant="h5" align='center'>Create Product</Typography>
            {isSuccess && <p>Product stored</p>}
            <p>{errorMessage}</p>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            error={!!formErrors.name}
                            label="name" id="name" name="name" helperText={formErrors.name} onBlur={handleBlur} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth error={!!formErrors.size}
                            label="size" id="size" helperText={formErrors.size} name="size" onBlur={handleBlur} />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel htmlFor="type">Type</InputLabel>
                        <Select
                            fullWidth
                            native
                            // error={!!formErrors.type}
                            inputProps={{
                                name: "type",
                                id: "type"

                            }}

                        >
                            <option value='' aria-label='None' />
                            <option value='electronic'>Electronic</option>
                            <option value='furniture'>Furniture</option>
                            <option value='clothing'>Clothing</option>
                        </Select>
                        {!!formErrors.type.length && <p>{formErrors.type}</p>}
                    </Grid>
                    <Grid item xs={12}>

                        <Button fullWidth disabled={isSaving} type="submit">Submit</Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    )
}
export default Form
