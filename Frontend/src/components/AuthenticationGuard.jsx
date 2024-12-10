import { withAuthenticationRequired } from "@auth0/auth0-react";
import PageLoader from "../pages/PageLoader";

export const AuthenticationGuard = ({component}) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: ()=>(
            <div>
                <PageLoader />
            </div>
        )
    });
    return <Component/>
}