import React, {useState, useEffect, useContext} from 'react';
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    useEffect(() => {
        console.log('Error', error);
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = e => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        } catch (e) {

        }
    }
    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (e) {

        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Short  your link</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Auth</span>
                        <div className="input-field">
                            <input
                                id="email"
                                type="text"
                                placeholder="Enter Email"
                                name="email"
                                onChange={changeHandler}
                                className="validate"/>
                                <label htmlFor="email">Email</label>
                        </div>
                        <div className="input-field">
                            <input
                                id="password"
                                type="password"
                                onChange={changeHandler}
                                placeholder="Enter Email"
                                name="password"/>
                            <label htmlFor="password">Enter Password</label>
                        </div>
                    <div className="card-action">
                        <button
                            className="btn yellow darken-4"
                            style={{marginRight: 10}}
                            disabled={loading}
                            onClick={loginHandler}>Log in</button>
                        <button
                            className="btn grey whiten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}>Sign Up</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}