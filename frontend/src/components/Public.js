// import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark" >
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">Notebook</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/login">Login</a>
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
            <main className="public__main container">
                <h1>Welcome to Notebook Haven</h1>
                <p>Explore the world of notebooks at Notebook Haven, where we cater to all your notebook needs.</p>
                <p>Located in the heart of Tech City, our store offers a wide range of notebooks, from sleek ultrabooks to powerful gaming laptops.</p>
                <p>Whether you're a student, professional, or a tech enthusiast, we have the perfect notebook for you.</p>
                <address className="public__addr">
                    Notebook Haven<br />
                    123 Tech Street<br />
                    Tech City, TC 54321<br />
                </address>
            </main>
            <footer className='bg-dark text-light text-center py-2'>
                Created with ❤️ by dev!
            </footer>
        </section>

    )
    return content
}
export default Public