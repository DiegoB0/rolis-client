import React, { useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { DeleteIcon } from "../assets/DeleteIcon.jsx";
import { EyeIcon } from "../assets/EyeIcon.jsx";
import { useNavigate } from 'react-router-dom';

const columns = [
	{
		key: "name",
		label: "NOMBRE DEL ARCHIVO",
	},
	{
		key: "actions",
		label: "ACCIONES",
	},
];

function ExcelSheetCard({ onDelete, files }) {
	const navigate = useNavigate();
	const handleDelete = (id) => {
		onDelete(id);
	};
	const [selectedFile, setSelectedFile] = useState(null);

	const handleDetailsClick = (id) => {
        // Aquí puedes buscar el archivo por su ID y establecerlo como el archivo seleccionado
        const file = files.find(file => file._id === id);
        setSelectedFile(file);
        // O navegar directamente a la pantalla de edición
        navigate('/new', { state: { file } });
    };

	const renderCell = React.useCallback((sheet, columnKey) => {
		switch (columnKey) {
			case "actions":
				return (
					<div className="relative flex items-center gap-2">
						<Tooltip content="Detalles">
							<span className="text-lg text-yellow-500 cursor-pointer active:opacity-50" onClick={() => handleDetailsClick(sheet._id)}>
								<EyeIcon />
							</span>
						</Tooltip>
						<Tooltip content="Descargar">
							<a className="text-lg text-blue-400 cursor-pointer active:opacity-50 mb-1" href={sheet.url}>
								<FileDownloadOutlinedIcon />
							</a>
						</Tooltip>
						<Tooltip color="danger" content="Eliminar">
							<span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(sheet._id)}>
								<DeleteIcon />
							</span>
						</Tooltip>
					</div>
				);
			case "name":
        		return sheet.filename;
			default:
				return null;
		}
	}, [onDelete]);

	return (
		<Table aria-label="Example table with dynamic content" className='w-2/6'>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn key={column.key} className={column.key === "actions" ? "w-0" : ""} >
						{column.label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody>
				{files.map((sheet) => (
					<TableRow key={sheet._id}>
						{columns.map((column) => (
							<TableCell key={column.key}>{renderCell(sheet, column.key)}</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export default ExcelSheetCard;