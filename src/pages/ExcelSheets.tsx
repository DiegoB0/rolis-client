import ExcelSheetCard from '@/components/ExcelSheetCard';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ExcelSheet {
	_id: string;
	name: string;
	url: string;
}

function ExcelSheets() {
	const [excelSheets, setExcelSheets] = useState<ExcelSheet[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const navigation = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('http://localhost:5000/excelsheets');
				const data = await response.json();
				setExcelSheets(data);
				setLoading(false); // Set loading to false once data is fetched
			} catch (error) {
				console.error('Error fetching Excel sheets:', error);
			}
		};

		fetchData();
	}, []);

	const handleDelete = (fileId) => {
		// Delete the Excel sheet with the given fileId
		fetch(`http://localhost:5000/deleteFile/${fileId}`, {
			method: 'DELETE',
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Excel sheet deleted:', data);
				// Remove the deleted Excel sheet from the state
				setExcelSheets((prevState) =>
					prevState.filter((sheet) => sheet._id !== fileId)
				);
			})
			.catch((error) => console.error('Error deleting Excel sheet:', error));
	};

	if (loading) {
		return <div>Loading...</div>; // Render loading indicator while fetching data
	}

	return (
		<div className="bg-red-300">
			<h2 className="text-xl">Tus Hojas de Excel</h2>
			<div className="bg-base-800 mt-5 mb-4">
				{excelSheets.map((sheet) => (
					<ExcelSheetCard
						key={sheet._id}
						file={sheet}
						onDelete={handleDelete}
					/>
				))}
			</div>
			<Button
				className="text-lg font-bold w-full"
				onClick={() => navigation('/new')}
			>
				Importar Excel
			</Button>
		</div>
	);
}

export default ExcelSheets;
