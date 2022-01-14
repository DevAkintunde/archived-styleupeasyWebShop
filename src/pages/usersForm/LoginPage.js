import { Route, Switch } from 'react-router-dom';
import { useContext } from 'react';
import PageTitle from "../../layout/PageTitle";
import { LoggedStatus } from '../../App';
import LoginForm from "./LoginForm";
import ResetLoginForm from './ResetLoginForm';
import RegisterForm from './RegisterForm';

const LoginPage = () => {
    const { loggedIn } = useContext(LoggedStatus);
    return (
        <>
            <Switch>
                <Route path={'/sign-in'} exact={true}>
                    <PageTitle title='Sign In' />
                    <LoginForm />
                </Route>
                <Route path={'/sign-in/register'}>
                    <PageTitle title={loggedIn ? 'Signed In' : 'Sign Up'} />
                    <RegisterForm />
                </Route>
                <Route path={'/sign-in/password-recovery'}>
                    <PageTitle title='Reset Password' />
                    <ResetLoginForm />
                </Route>
            </Switch>

        </>
    )
}

export default LoginPage