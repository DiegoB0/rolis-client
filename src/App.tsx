import { Route, Routes } from 'react-router-dom';
import ExcelSheets from './pages/ExcelSheets';
import ExcelSheetsNew from './pages/ExcelSheetsNew';
import "./App.css"
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/auth';
import { PublicRoute } from './components/PublicRoute';

function App() {
	const isAuth = useAuthStore(state => state.isAuth);

	return (
		<Routes>
			<Route
				path='/login'
				element={
					<PublicRoute isAuth={isAuth}>
						<Login />
					</PublicRoute>
				}
			/>

			<Route element={<ProtectedRoute isAllowed={isAuth} />}>
				<Route path='/' element={<ExcelSheets />} />
				<Route path='/new' element={<ExcelSheetsNew />} />
			</Route>
		</Routes>
	);
}

export default App;
