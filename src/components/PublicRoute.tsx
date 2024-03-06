import { Navigate, Outlet } from "react-router-dom";

interface Props {
    isAuth: boolean,
    children?: React.ReactNode
}

export const PublicRoute = ({ isAuth, children }: Props) => {
    // Si el usuario está autenticado (isAuth es verdadero), redirige a la página principal.
    if (isAuth) return <Navigate to="/" replace />;
    // Si no está autenticado, renderiza los componentes hijos o el <Outlet /> si no hay hijos.
    return children ? <>{children}</> : <Outlet />;
}
