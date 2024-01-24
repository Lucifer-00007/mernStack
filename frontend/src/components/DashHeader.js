import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import useAuth from '../hooks/useAuth';
import PulseLoader from 'react-spinners/PulseLoader';

// Import Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';

// Regular expressions for route matching
const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
    const { isManager, isAdmin } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Logout mutation hook
    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    // Effect to navigate to the home page after successful logout
    useEffect(() => {
        if (isSuccess) navigate('/');
    }, [isSuccess, navigate]);

    // Click handlers for navigation
    const onNewNoteClicked = () => navigate('/dash/notes/new');
    const onNewUserClicked = () => navigate('/dash/users/new');
    const onNotesClicked = () => navigate('/dash/notes');
    const onUsersClicked = () => navigate('/dash/users');

    // CSS class for the header container
    let dashClass = null;
    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small";
    }

    // Logout button component
    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    );

    // Error message class
    const errClass = isError ? "errmsg" : "offscreen";

    // Dynamically render buttons based on the current route
    let newNoteButton = null;
    if (NOTES_REGEX.test(pathname)) {
        newNoteButton = (
            <button
                className="icon-button"
                title="New Note"
                onClick={onNewNoteClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        );
    }

    let newUserButton = null;
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button
                className="icon-button"
                title="New User"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        );
    }

    let userButton = null;
    if (isManager || isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <button
                    className="icon-button"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            );
        }
    }

    let notesButton = null;
    if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
        notesButton = (
            <button
                className="icon-button"
                title="Notes"
                onClick={onNotesClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        );
    }

    // Conditional rendering based on loading state
    let buttonContent;
    if (isLoading) {
        buttonContent = <PulseLoader color={"#FFF"} />;
    } else {
        buttonContent = (
            <>
                {newNoteButton}
                {newUserButton}
                {notesButton}
                {userButton}
                {logoutButton}
            </>
        );
    }

    // JSX for the entire component
    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            {/* Bootstrap Navbar component */}
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand as={Link} to="/dash">
                    <h1 className="dash-header__title">techNotes</h1>
                </Navbar.Brand>
                <Nav className="mr-auto">
                    {buttonContent}
                </Nav>
            </Navbar>
        </>
    );

    return content;
};

export default DashHeader;
