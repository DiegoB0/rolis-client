import ExcelSheetCard from '@/components/ExcelSheetCard';
import { Button } from '@nextui-org/react';
import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Tooltip } from '@nextui-org/react';

interface ExcelSheet {
	_id: string;
	name: string;
	url: string;
}

function ExcelSheets() {
	const [excelSheets, setExcelSheets] = useState<ExcelSheet[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const navigation = useNavigate();
	const logout = useAuthStore(state => state.logout);
	const profile = useAuthStore(state => state.profile);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('http://localhost:5000/excelsheets');
				const data = await response.json();
				const filteredData = profile.username.type === 'User' ? data.filter((sheet: { userId: any; }) => sheet.userId == profile.username.userId) : data;
				setExcelSheets(filteredData);
				setLoading(false); // Set loading to false once data is fetched
			} catch (error) {
				console.error('Error fetching Excel sheets:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [profile]);

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
		<>
			<div className="bg-red-300 flex flex-col justify-center items-center">
				<div className='flex flex-row items-center self-center relative'>
					<h2 className="text-3xl text-center font-bold text-[#fff] mt-5 w-fit">{profile.username.name} Tus Hojas de Excel</h2>
					<Tooltip color="danger" content="Salir" placement='left'>
						<Button
							onClick={() => {
								logout();
								navigation("/login");
							}}
							className='absolute -left-28 top-5 text-white bg-transparent hover:bg-red-500'
						>
							<LogoutOutlinedIcon />
						</Button>
					</Tooltip>
				</div>
				<div className="mt-5 mb-4 flex flex-col justify-center items-center w-full">
					<ExcelSheetCard onDelete={handleDelete} files={excelSheets} />
				</div>
			</div>
			<div className='flex flex-col justify-center items-center'>
				<Button
					className="text-lg flex flex-col w-36 mt-14 text-center bg-green-500"
					onClick={() => navigation('/new')}
					style={{ color: "white", fontWeight: "bold" }}
				>
					Importar Excel
				</Button>
			</div>
		</>
	);
}

export default ExcelSheets;
