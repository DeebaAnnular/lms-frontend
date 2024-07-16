"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const AuthRoute = (WrappedComponent, allowedRoles) => {
    const AuthComponent = (props) => {
        const user = useSelector(state => state.user.userDetails);
        const router = useRouter();
        const [isAuthorized, setIsAuthorized] = useState(false);

        useEffect(() => {
            const role = user?.user_type;
            const token = user?.token;

            if (!token) {
                router.replace('/');
                return;
            }

            if (!allowedRoles.includes(role)) {
                router.push('/not-authorized');
            } else {
                setIsAuthorized(true);
            }
        }, [router, user]);

        if (!isAuthorized) {
            return null; // Or return a loading spinner/component
        }

        return <WrappedComponent {...props} />;
    };

    // Set a display name for the wrapped component for better debugging
    AuthComponent.displayName = `AuthRoute(${getDisplayName(WrappedComponent)})`;

    return AuthComponent;
};

// Helper function to get the display name of a component
const getDisplayName = (WrappedComponent) => {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default AuthRoute;
