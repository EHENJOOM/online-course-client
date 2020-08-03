import Loadable from "react-loadable"
import Loading from "../component/loading";

const Login = Loadable({
    loader: () => import("./login"),
    loading: Loading
});
const NotFound = Loadable({
    loader: () => import("./notfound"),
    loading: Loading
});

export {
    Login,
    NotFound,
}