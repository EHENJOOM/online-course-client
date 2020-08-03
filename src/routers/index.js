import {Login, NotFound} from "../view";

const commonRoutes = [
    {
        pathname: '/login',
        component: Login
    },
    {
        pathname: '/404',
        component: NotFound
    }
];

export {
    commonRoutes,
}