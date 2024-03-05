import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import React, { useState } from 'react';
import { FaRegFileExcel } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

interface ExcelRow {
	[key: string]: string | number | boolean | Date;
}

function ExcelSheetsNew() {
	const [data, setData] = useState<ExcelRow[]>([]);
	const [columnNames, setColumnNames] = useState<string[]>([]);
	const [fileName, setFileName] = useState<string>('');
	const navigation = useNavigate();

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.readAsBinaryString(file);
			reader.onload = (e) => {
				if (e.target) {
					const data = e.target.result as string;
					const workbook = XLSX.read(data, { type: 'binary' });
					const sheetName = workbook.SheetNames[0];
					const sheet = workbook.Sheets[sheetName];
					const parseData = XLSX.utils.sheet_to_json<ExcelRow>(sheet);
					const columnNames = Object.keys(parseData[0]);
					setColumnNames(columnNames);
					setData(parseData);
					setFileName(file.name.replace(/\.[^/.]+$/, ''));
				}
			};
		}
	};

	const handleColumnNameChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		columnIndex: number
	) => {
		const newColumnNames = [...columnNames];
		newColumnNames[columnIndex] = e.target.value;
		setColumnNames(newColumnNames);

		// Update keys in data objects to match new column names
		const newData = data.map((row) => {
			const newRow: ExcelRow = {};
			Object.keys(row).forEach((key, index) => {
				newRow[newColumnNames[index]] = row[key];
			});
			return newRow;
		});
		setData(newData);
	};

	const handleCellValueChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		rowIndex: number,
		columnName: string
	) => {
		const newData = [...data];
		newData[rowIndex][columnName] = e.target.value;
		setData(newData);
	};

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		XLSX.writeFile(workbook, `${fileName}.xlsx`);
	};

	const saveExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		const excelBuffer = XLSX.write(workbook, {
			bookType: 'xlsx',
			type: 'array',
		});
		const blob = new Blob([excelBuffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
		});
		const formData = new FormData();
		formData.append('uploadfile', blob, `${fileName}.xlsx`);

		// Send the Excel file to the API
		fetch('http://localhost:5000/uploadExcelFile', {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Upload successful:', data);
				// Handle success response if needed
			})
			.catch((error) => {
				console.error('Upload error:', error);
				// Handle error if needed
			});
		navigation('/');
	};

	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [selectedColumns, setSelectedColumns] = useState<number[]>([]);

	const handleRowCheckboxChange = (index: number) => {
		if (selectedRows.includes(index)) {
			setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
		} else {
			setSelectedRows([...selectedRows, index]);
		}
	};

	const handleColumnCheckboxChange = (index: number) => {
		if (selectedColumns.includes(index)) {
			setSelectedColumns(
				selectedColumns.filter((colIndex) => colIndex !== index)
			);
		} else {
			setSelectedColumns([...selectedColumns, index]);
		}
	};

	const handleDelete = () => {
		// Remove selected rows
		const newData = data.filter(
			(_, rowIndex) => !selectedRows.includes(rowIndex)
		);

		// If no columns are selected for deletion, skip the column deletion logic
		if (selectedColumns.length === 0) {
			setData(newData);
			return;
		}

		// Create a new set of column names excluding the selected ones
		const newColumnNames = columnNames.filter(
			(_, columnIndex) => !selectedColumns.includes(columnIndex)
		);

		// Adjust the data to match the new set of column names
		const adjustedData = newData.map((row) => {
			const newRow = {};
			newColumnNames.forEach((columnName) => {
				newRow[columnName] = row[columnName];
			});
			return newRow;
		});

		// Update your data and column names with the new filtered data and column names
		setData(adjustedData);
		setColumnNames(newColumnNames); // Assuming you have a state to manage column names
	};

	return (
		<div className="text-2xl text-custom-light md:p-8 p-6">
			<h1>Excel Sheets</h1>
			<input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

			{data.length > 0 && (
				<>
					<div className="flex justify-between gap-2 bg-base-800 p-4 rounded-lg">
						<input
							type="text"
							value={fileName}
							onChange={(e) => setFileName(e.target.value)}
							placeholder="Escribe el titulo del excel"
							className="bg-base-900 rounded-xl text-lg h-10 p-4"
						/>
						<div className=" flex gap-4">
							<div className="border-custom-gray flex gap-1 border-2 rounded-lg px-2 text-lg items-center hover:bg-custom-gray transition-all duration-200 py-1">
								<MdDeleteOutline />
								<button onClick={handleDelete}>Eliminar</button>
							</div>

							<div className="bg-accent-green flex px-2 py-1 border-custom-mate border-2 rounded-lg  gap-1 text-lg items-center hover:bg-emerald-700 transition-all duration-200">
								<FaRegFileExcel />
								<button onClick={exportToExcel}>Exportar</button>
							</div>

							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										className="bg-accent-yellow flex px-4 py-5 border-custom-mate border-2 rounded-lg  gap-1 text-lg items-center hover:bg-yellow-600 transition-all duration-200"
									>
										<span>
											<FiPlusCircle />
										</span>
										Nuevo
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px] bg-base-800">
									<DialogHeader>
										<DialogTitle>Agregar</DialogTitle>
										<DialogDescription>
											Agrega nuevas columnas o filas segun lo necesites.
										</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<div className="grid grid-cols-4 items-center gap-4">
											<Select>
												<SelectTrigger className="w-[375px]">
													<SelectValue placeholder="Seleccionar columna/fila" />
												</SelectTrigger>
												<SelectContent className="bg-base-900 text-custom-mate">
													<SelectGroup>
														<SelectItem value="row">Fila</SelectItem>
														<SelectItem value="column">Columna</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
										</div>
										<div className="grid grid-cols-4 items-center gap-4">
											<Label htmlFor="username" className="text-right">
												Username
											</Label>
											<Input
												id="username"
												value="@peduarte"
												className="col-span-3"
											/>
										</div>
									</div>
									<DialogFooter>
										<Button
											type="submit"
											className="bg-base-900 border-2 border-custom-mate hover:border-base-900 "
										>
											Guardar
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</div>

					<div className=" border-b-2 border-r-2 border-l-2 rounded p-2">
						<table className="w-full">
							<thead>
								<tr>
									<th></th>
									{columnNames.map((columnName, index) => (
										<th key={index}>
											<input
												type="checkbox"
												onChange={() => handleColumnCheckboxChange(index)}
												checked={selectedColumns.includes(index)}
												className="mr-2 my-4"
											/>
											<input
												type="text"
												value={columnName}
												onChange={(e) => handleColumnNameChange(e, index)}
												className="bg-base-900 h-8 text-lg"
											/>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{data.map((row, rowIndex) => (
									<tr key={rowIndex} className="border-t-[1px]">
										<td>
											<input
												type="checkbox"
												onChange={() => handleRowCheckboxChange(rowIndex)}
												checked={selectedRows.includes(rowIndex)}
												className="mr-2 my-4"
											/>
										</td>
										{columnNames.map((columnName, cellIndex) => (
											<td key={cellIndex}>
												<input
													type="text"
													value={String(row[columnName])}
													onChange={(e) =>
														handleCellValueChange(e, rowIndex, columnName)
													}
													className="bg-base-900  text-lg"
												/>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<Button
						className="w-full font-bold text-lg hover:bg-base-900 border-2 border-base-800 hover:border-custom-gray"
						onClick={saveExcel}
					>
						Guardar
					</Button>
				</>
			)}
		</div>
	);
}

export default ExcelSheetsNew;
