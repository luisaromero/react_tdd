import React from 'react';
import { TextField, InputLabel, Select, Button } from '@mui/material';


export const Form = () =>
    <>
        <h1>Create Product</h1>
        <form>
            <TextField label="name" id="name" />

            <TextField label="size" id="size" />

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
                <option value='electronic'>Electronic</option>
                <option value='furniture'>Furniture</option>
                <option value='clothing'>Clothing</option>
            </Select>
            <Button>Submit</Button>
        </form>
    </>

export default Form
