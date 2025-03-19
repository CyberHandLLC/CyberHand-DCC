# CyberHand Authentication System Test Guide

This guide provides step-by-step instructions for testing the complete authentication flow in the CyberHand platform.

## Prerequisites

1. Both the server and client applications must be running:
   ```
   # In one terminal (server)
   cd server
   npm run dev
   
   # In another terminal (client)
   cd client
   npm run dev
   ```

2. Make sure your database is properly set up and migrations have been applied.

## Test 1: Registration Flow

1. **Access the registration page**
   - Navigate to: `http://localhost:5173/register`
   - Verify the registration form loads with fields for:
     - First name
     - Last name
     - Email
     - Password
     - Confirm password

2. **Test validation errors**
   - Try submitting without completing required fields
   - Expected result: Form validation errors are displayed
   - Try entering mismatched passwords
   - Expected result: "Passwords do not match" error is displayed
   - Try entering an invalid email format
   - Expected result: "Invalid email format" error is displayed
   - Try entering a short password (less than 8 characters)
   - Expected result: Password requirement error is displayed

3. **Test successful registration**
   - Enter valid information for all fields
   - Submit the form
   - Expected result: 
     - Success notification appears
     - Redirected to login page

## Test 2: Login Flow

1. **Access the login page**
   - Navigate to: `http://localhost:5173/login`
   - Verify the login form loads with email and password fields

2. **Test invalid credentials**
   - Enter an email that doesn't exist in the system
   - Enter any password
   - Submit the form
   - Expected result: "Invalid email or password" error is displayed
   - Try a valid email with incorrect password
   - Expected result: Same error message (for security, error doesn't specify which field is wrong)

3. **Test successful login**
   - Enter valid credentials (use the account you just created)
   - Submit the form
   - Expected result:
     - Success notification appears
     - Redirected to dashboard page
     - User information is displayed in the dashboard

4. **Verify tokens (Developer Tools)**
   - Open browser developer tools (F12)
   - Go to Application tab > Cookies
   - Verify HttpOnly cookies are set (you won't see their values due to HttpOnly flag)

## Test 3: Protected Routes and Role-Based Access

1. **Dashboard access**
   - Verify you can access the dashboard while logged in
   - Confirm dashboard shows content appropriate for your user role

2. **Role-specific route access**
   - Try accessing `/admin` route
   - Expected result: If you're not an admin, you should be redirected to the unauthorized page
   - Try accessing `/staff` routes
   - Expected result: Access should depend on your user role
   - Try accessing `/client` routes
   - Expected result: Access should depend on your user role

3. **Direct URL navigation test**
   - Log out (if logged in)
   - Try navigating directly to `/dashboard`
   - Expected result: Redirected to login page
   - After logging in, you should be redirected back to the dashboard

## Test 4: Token Refresh Mechanism

This test is more advanced and verifies that the token refresh mechanism works correctly.

1. **Setup for refresh test**
   - Log in to the application
   - Keep the application open for longer than the access token expiry time
     - Note: For testing, the access token may be set to expire quickly (e.g., 5-15 minutes)
     - You can do other tests during this time

2. **Verify continued access**
   - After the access token should have expired, try to access a protected resource
   - Expected result: You should still have access without being asked to log in again
   - This indicates the refresh token is working correctly

3. **Advanced verification (Optional)**
   - Open the developer tools Network tab
   - After the access token expires, perform an action that requires authentication
   - Look for a request to `/api/auth/refresh` in the network tab
   - This confirms the refresh mechanism is working

## Test 5: Logout Flow

1. **Perform logout**
   - Click the logout button on the dashboard
   - Expected result: 
     - Redirected to login page
     - Success notification of logout

2. **Verify session termination**
   - Try to access `/dashboard` after logout
   - Expected result: Redirected to login page

3. **Verify cookie removal**
   - Check browser cookies (Developer Tools > Application > Cookies)
   - Expected result: Authentication cookies should be removed

## Complete Flow Test

To test the entire flow at once:

1. Register a new account
2. Login with the new account
3. Access the dashboard and verify role-specific content
4. Try accessing other role-specific routes
5. Wait for token expiry and verify refresh works
6. Logout and verify access is revoked

## Debugging Tips

If you encounter issues:

1. Check browser console (F12 > Console) for frontend errors
2. Check server logs for backend errors
3. Verify network requests/responses (F12 > Network) for details about API calls
4. Confirm cookies are being set properly (F12 > Application > Cookies)
5. Reset the application state by clearing cookies if needed

## Test Users (Optional)

If you set up seed data in the database, you can test with these predefined users:

- Admin: admin@cyberhand.com / password123
- Staff: staff@cyberhand.com / password123
- Client: client@cyberhand.com / password123
- Observer: observer@cyberhand.com / password123
