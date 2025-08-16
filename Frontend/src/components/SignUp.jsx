import React from 'react'

export default function SignUp() {
    return (
        <div className="container">
            <label>
                Name:
                <input type="text" name='username' />
            </label>
            <label>
                Email:
                <input type="email" name="email" />
            </label>
            <label>
                Password:
                <input type="password" name="password" />
            </label>
            <button>
                Already User, Login
            </button>
        </div>
    )
}
