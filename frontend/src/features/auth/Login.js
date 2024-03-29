import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import useTitle from '../../hooks/useTitle'
import PulseLoader from 'react-spinners/PulseLoader'

const Login = () => {
    useTitle('Employee Login')

    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            navigate('/dash')
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

    const errClass = errMsg ? "errmsg" : "offscreen"

    if (isLoading) return <PulseLoader color={"#FFF"} />

    const content = (
        <section className="public">
            <header>
                <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark" >
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">Employee-Login</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/">Home</a>
                                </li>

                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Dropdown
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="/">Action</a></li>
                                        <li><a className="dropdown-item" href="/">Another action</a></li>
                                        <li><a className="dropdown-item" href="/">Something else here</a></li>
                                    </ul>
                                </li>

                            </ul>

                        </div>
                    </div>
                </nav>
            </header>
            <main className="login container">
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <div className="card py-4 ">
                    <form className="form mx-auto " onSubmit={handleSubmit}>
                        <h3 className='text-center'>Employee Login</h3>

                        <div className="input-group mb-3">

                            <span className="input-group-text" id="basic-addon1"><i class="fa-solid fa-user"></i></span>
                            <input
                                className="form-control"
                                type="text"
                                id="username"
                                ref={userRef}
                                value={username}
                                onChange={handleUserInput}
                                autoComplete="off"
                                required
                                placeholder="Username"
                            />

                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1"><i class="fa-solid fa-lock"></i></span>
                            <input
                                className="form-control"
                                type="password"
                                id="password"
                                onChange={handlePwdInput}
                                value={password}
                                placeholder="Password"
                                required
                            />
                        </div>

                        <label htmlFor="persist" className="form__persist">
                            <input
                                type="checkbox"
                                className="form__checkbox"
                                id="persist"
                                onChange={handleToggle}
                                checked={persist}
                            />
                            Trust This Device
                        </label>

                        <div className="text-center form-group">
                            <button id="insertBtn" type="submit" className="btn btn-primary btn-block">
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <footer className='bg-dark text-light text-center py-2'>
                Created with ❤️ by dev!
            </footer>
        </section>
    )

    return content
}
export default Login