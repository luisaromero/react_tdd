import React, { useState } from 'react';
import { TextField, InputLabel, Select, Button } from '@mui/material';
import { saveProduct } from '../services/producServices';
import { CREATED_STATUS } from '../consts/httpStatus';


export const Form = () => {

    const [formErrors, setFormErrors] = useState({
        name: "",
        size: "",
        type: ""
    })

    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true)
        const { name, size, type } = e.target.elements
        validateForm(getFormValues({ name, size, type }))
        const response = await saveProduct(getFormValues({ name, size, type }))

        if (response.status === CREATED_STATUS) {
            e.target.reset()
            setIsSuccess(true);
        }
        setIsSaving(false)

    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        validateField({ name, value })
    }

    return (
        <>
            {isSuccess && <p>Product stored</p>}
            <h1>Create Product</h1>
            <form onSubmit={handleSubmit}>
                <TextField label="name" id="name" name="name" helperText={formErrors.name} onBlur={handleBlur} />

                <TextField label="size" id="size" helperText={formErrors.size} name="size" onBlur={handleBlur} />

                <InputLabel htmlFor="type">Type</InputLabel>
                <Select
                    native
                    inputProps={{
                        name: "type",
                        id: "type"

                    }}

                // value=''
                // label="Age"
                // onChange={handleChange}
                >
                    <option value='' aria-label='None' />
                    <option value='electronic'>Electronic</option>
                    <option value='furniture'>Furniture</option>
                    <option value='clothing'>Clothing</option>
                </Select>
                {formErrors.type.length > 0 ? formErrors.type : ""}
                <Button disabled={isSaving} type="submit">Submit</Button>
            </form>
        </>
    )
}
export default Form
