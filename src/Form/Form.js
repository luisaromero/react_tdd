import React, { useState } from 'react';
import { TextField, InputLabel, Select, Button } from '@mui/material';


export const Form = () => {

    const [formErrors, setFormErrors] = useState({
        name: "",
        size: "",
        type: ""
    })

    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true)
        const { name, size, type } = e.target.elements
        if (!name.value) {
            setFormErrors(prevState => ({ ...prevState, name: "The name is required" }))
        }
        if (!size.value) {
            setFormErrors(prevState => ({ ...prevState, size: "The size is required" }))
        }
        if (!type.value) {
            setFormErrors(prevState => ({ ...prevState, type: "The type is required" }))
        }

        await fetch('/products', {
            method: "POST",
            body: JSON.stringify({})
        })

        setIsSaving(false)

    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        setFormErrors({ ...formErrors, [name]: value.length ? "" : `The ${name} is required` })
    }

    return (
        <>
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

                    value=''
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
