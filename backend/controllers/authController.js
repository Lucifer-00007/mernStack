const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

// @desc Signup
// @route POST /auth
// @access Public
const signup = async (req, res) => {
    const { username, password, roles } = req.body

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "password": hashedPwd }
        : { username, "password": hashedPwd, roles }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created!` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}

// @desc sendEmail
// @route POST /auth
// @access Public
const sendEmail = async (req, res) => {
    try {
        const { name, email, subject, message, type } = req.body;

        //input data validation
        if (!name || !email || !subject || !message || !type) {
            throw new Error("All fields are required!");
        }

        function send_user_mail(details_info) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "files.backup.777@gmail.com",
                    pass: "lxjezcwjggymzblh",
                }
            });

            transporter.sendMail(details_info, function (err, info) {
                if (err) {
                    console.log(err)
                    return err;
                } else {
                    //console.log(info);
                    return info
                }
            })
        }

        if (type === "CONTACT") {
            const contactOptions = {
                from: "files.backup.777@gmail.com",
                to: "ani.mimansatech@gmail.com",
                subject: subject,
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n`
            }

            send_user_mail(contactOptions);

            res.status(200).json({ success: true, details: "Email sent successfully!" });
        } else {
            //Incorrect email type error
            throw new Error("Invalid type provided in body!");
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: { message: err.message } });
    }
}

// @desc sendEmailOtp
// @route POST /auth
// @access Public
const sendEmailOtp = async (req, res) => {
    try {
        const { email, type } = req.body;

        //input data validation
        if (!email || !type) {
            throw new Error("Email or Type missing in body!");
        }

        //Generate OTP
        const otp = Math.floor(Math.random() * 100000) + 100000;
        const now = new Date();

        //Otp expiration time
        // const expiration_time = AddMinutesToDate(now, 2);

        //Create VerificationRequest Instance in DB
        // const vr = await VerificationRequest.create({
        // 	otp,
        // 	expires: expiration_time,
        // });

        //details object containing the email
        const details = {
            timestamp: now,
            email: email,
            status: "success",
            OTP: otp.toString(),
        };

        //Encrypting details Object
        // const encoded = symmetricEncrypt(JSON.stringify(details), ENCRYPTION_KEY);


        function send_user_mail(details_info) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "files.backup.777@gmail.com",
                    pass: "lxjezcwjggymzblh",
                }
            });

            transporter.sendMail(details_info, function (err, info) {
                if (err) {
                    console.log(err)
                    return err;
                } else {
                    //console.log(info);
                    return info
                }
            })
        }


        if (type === "SIGNUP") {
            //Signup email details
            const signupOptions = {
                from: "zocar.app@gmail.com",
                to: email,
                subject: "OTP Verification",
                text: `Dear Customer your otp is: ${otp.toString()}`
            }
            // console.log(emailManager.emailOtpFile);

            //Signup Confirmation otp email
            send_user_mail(signupOptions);

            res.status(200).json({ success: true, details: details });
        } else if (type === "RESET_PASSWORD") {
            //Reset Password confirmation otp email
            // const sentMail = await sendResetPinOtp(emailPayload);
        } else {
            //Incorrect email type error
            throw new Error("Invalid email type provided in body!");
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: { message: err.message } });
    }
}

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    signup,
    sendEmail,
    sendEmailOtp,
    login,
    refresh,
    logout
}