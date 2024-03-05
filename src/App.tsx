import { Route, Routes } from 'react-router-dom';
import ExcelSheets from './pages/ExcelSheets';
import ExcelSheetsNew from './pages/ExcelSheetsNew';

function App() {
	return (
		<Routes>
			<Route path="/" element={<ExcelSheets />} />
			<Route path="/new" element={<ExcelSheetsNew />} />
		</Routes>
	);
}

export default App;
