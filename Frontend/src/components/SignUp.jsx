import React, { useState } from 'react';

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null)

    function changeHandler(e) {
        // console.log(e.target.value)
        // console.log(e.target.name)
        setFormData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });

        console.log(formData);
    }


    async function submitHandler(e) {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || `HTTP error! Status: ${res.status}`);
            }


            setError({ type: "success", message: data.message });
        } catch (err) {

            setError({ type: "error", message: err.message });
        }
    }

    return (
        <div className='container'>
            <form onSubmit={submitHandler}>
                <label>
                    Name:
                    <input
                        type='text'
                        name='username'
                        value={formData.username}
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={changeHandler}
                    />
                </label>
                <button type='submit'>Login</button>
            </form>
            {error && <div>{error.message}</div>}
            <button>Already User, Login</button>
        </div>
    );
}
